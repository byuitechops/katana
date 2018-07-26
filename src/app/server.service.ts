import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseService } from './course.service';
import { ToolService } from './tool.service';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { auth, database } from 'firebase';
import { AuthGuardService } from './authguard.service';

/**
 * Provides access to make calls to the Katana server.
 */
@Injectable({
    providedIn: 'root'
})
export class KatanaService {

    /**
     * Handles formatting the correct URL for the web sockets.
     */
    serverDomain = window.location.hostname.replace(/www./, '') + (window.location.port ? ':' + window.location.port : '');

    /**
     * If an error is returned by the server, it is stored here for public access.
     */
    error: Error;

    /**
     * Constructor
     * @param http - Currently used to retrieve basic data from the server.
     * @param toolService - Provides information about available tools on the server.
     * @param courseService  - Provides information and management for the currently selected courses.
     * @param router - Used to navigate the user as needed.
     * @param toastService - Provides toast functionality.
     */
    constructor(private http: HttpClient,
        private toolService: ToolService,
        private courseService: CourseService,
        private router: Router,
        private authGuardService: AuthGuardService,
        private toastService: ToastService) {

        // Listens to changes in the auth state, and if the user is valid,
        // it retrieves the list of tools from the server
        authGuardService.authState.subscribe(state => {
            if (state) {
                this.getToolList()
                    .catch(console.error);
            } else {
                toolService.toolList = [];
            }
        });

    }

    /**
     * Currently open web sockets.
     */
    sockets: WebSocket[] = [];

    /** ***************************************************************
     * Retrieves the list of tools from the server.
     *****************************************************************/
    getToolList() {
        return new Promise(async (resolve, reject) => {
            if (!this.authGuardService.canActivate()) {
                return reject(new Error('ToolList: User is not authenticated.'));
            }
            this.authGuardService.retrieveToken()
                .then(userIdToken => {
                    this.http.get(`/api/tool-list?userIdToken=${userIdToken}`).subscribe(
                        (toolList: any): any => {
                            this.toolService.toolList = toolList;
                            resolve();
                        },
                        (err) => {
                            this.errorHandler(err);
                            reject();
                        });
                })
                .catch(this.errorHandler);

        });
    }

    /** ***************************************************************
     * Retrieves a list of courses from Canvas.
     *****************************************************************/
    getCourses(body) {
        return new Promise((resolve, reject) => {
            if (!this.authGuardService.canActivate()) {
                return reject(new Error('Course Search: User is not authenticated.'));
            }
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');

            this.authGuardService.retrieveToken()
                .then(userIdToken => {
                    this.http.post(`/api/course-retrieval?userIdToken=${userIdToken}`, body, { headers: headers }).subscribe(
                        (data) => {
                            resolve(data);
                        },
                        (err) => {
                            this.errorHandler(err);
                            reject();
                        });
                })
                .catch(this.errorHandler);
        });
    }

    /**
     * Has the server log when a user's auth status changes (log in, log out, etc.)
     * DEPRECATED
     */
    logUserStatus(userEmail: string, message: string) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        headers.append('Content-Type', 'application/json');

        this.http.post('/api/user-status', { userEmail, message }, { headers: headers }).subscribe(
            () => { },
            this.errorHandler);
    }

    /**
     * Runs a tool on the server in discovery mode, then returns the issue items discovered.
     * @param {string} toolId - The ID of the tool to be run
     * @param {object} options - An object containing the option values specific to the tool
     * @returns {object[]} - Array of issue items discovered by the tool on the server
     */
    discoverIssues(courses) {
        return new Promise(async (resolve, reject) => {
            if (!this.authGuardService.canActivate()) {
                return reject(new Error('Discover: User is not authenticated.'));
            }

            this.toolService.processingMessage = 'Searching for Issues...';
            this.toolService.processing = true;
            let completed = 0;

            let userIdToken;
            try {
                userIdToken = await this.authGuardService.retrieveToken();
            } catch (err) {
                this.errorHandler(err);
            }

            const socket = new WebSocket(`ws://${this.serverDomain}/api/tool/discover?userIdToken=${userIdToken}`);
            this.sockets.push(socket);

            /* Normally, you would just listen for the 'open' event and start sending messages
            to the server. However, the auth middleware on the server causes a delay that
            prevents the event listeners for each particular web socket from being set up. The
            messages sent immediately when the web socket are opened are received, but never
            handled. Instead, it is set up here to wait for the server to tell the client that
            it is good to go before it starts sending messages. */
            socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                if (data.state === 'READY') {
                    courses.forEach(course => {
                        // Set the course processing
                        course.processing = true;
                        // Remove any pre-existing error
                        delete course.error;

                        const data = JSON.stringify({
                            tool_id: this.toolService.selectedTool.id,
                            course: course,
                            options: this.toolService.selectedDiscoverOptions,
                            userEmail: auth().currentUser.email
                        });
                        socket.send(data);
                    });
                } else {
                    const course = data;

                    if (course.error) {
                        console.error(`${course.course_code} (${course.id}): ${course.error}`);
                    }

                    this.courseService.coursesObj[`c${course.id}`] = course;
                    course.processing = false;
                    completed++;

                    // Update the currently selected course, if this is the currently selected course
                    if (course.id === this.courseService.selectedCourse.id) {
                        this.courseService.selectedCourse = this.courseService.coursesObj[`c${course.id}`];
                    }

                    // If this was the last course, then close the socket
                    if (completed === courses.length) {
                        this.toolService.processing = false;
                        socket.close();
                    }
                }
            });

            socket.onerror = (err) => {
                courses.forEach(course => {
                    course.processing = false;
                    course.error = new Error('Socket unexpectedly closed.');
                });
                this.toolService.processing = false;
                this.errorHandler(err);
            };
        });
    }

    /**
     * Fixes the provided issue items in Canvas by sending them to the specified tool on the server.
     * @param {string} toolId - The ID of the tool to be run
     * @param {object} options - An object containing the option values specific to the tool
     * @returns {object[]} - Array of issue items fixed by the tool on the server
     */
    fixIssues(courses) {
        return new Promise(async (resolve, reject) => {
            if (!this.authGuardService.canActivate()) {
                return reject(new Error('Fix: User is not authenticated.'));
            }

            this.toolService.processingMessage = 'Fixing Issues...';
            this.toolService.processing = true;

            const fixables = courses.filter(course => {
                return course.issueItems && course.issueItems.some(issueItems => {
                    if (issueItems.issues.some(issue => issue.status === 'approved')) {
                        course.processing = true;
                        return true;
                    } else {
                        course.processing = false;
                        return false;
                    }
                });
            });

            let userIdToken;
            try {
                userIdToken = await this.authGuardService.retrieveToken();
            } catch (err) {
                this.errorHandler(err);
            }

            let completed = 0;

            const socket = new WebSocket(`ws://${this.serverDomain}/api/tool/fix?userIdToken=${userIdToken}`);
            this.sockets.push(socket);

            socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                if (data.state === 'READY') {
                    fixables.forEach(course => {
                        course.processing = true;
                        // Save the option values for each issue, but remove the formGroup and questionModel
                        course.issueItems.forEach(issueItem => {
                            issueItem.issues.forEach(issue => {
                                if (issue.formGroup) {
                                    issue.optionValues = issue.formGroup.value;
                                    delete issue.formGroup;
                                    delete issue.questionModel;
                                }
                            });
                        });

                        let data = JSON.stringify({
                            tool_id: this.toolService.selectedTool.id,
                            course: course,
                            options: this.toolService.selectedDiscoverOptions,
                            userEmail: auth().currentUser.email
                        });
                        socket.send(data);
                    });
                } else {
                    const course = data;
                    if (course.error) {
                        console.error(`${course.course_code} (${course.id}): ${course.error}`);
                    }

                    this.courseService.coursesObj[`c${course.id}`] = course;
                    course.processing = false;
                    completed++;

                    // Update the currently selected course, if this is the currently selected course
                    if (course.id === this.courseService.selectedCourse.id) {
                        this.courseService.selectedCourse = this.courseService.coursesObj[`c${course.id}`];
                    }

                    // If this was the last course, then close the socket
                    if (completed === fixables.length) {
                        this.toolService.processing = false;
                        socket.close();
                    }
                }

            });

            socket.onerror = (err) => {
                courses.forEach(course => {
                    course.processing = false;
                    course.error = new Error('Socket unexpectedly closed.');
                });
                this.toastService.toastError(err);
                this.toolService.processing = false;
                this.errorHandler(err);
            };
        });
    }

    errorHandler(e) {
        console.error(e);
        this.error = e;
        this.router.navigate(['home', 'error']);
    }
}
