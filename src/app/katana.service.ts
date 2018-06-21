import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseService, IssueItem, Course } from './course.service';
import { ToolService, Tool } from './tool.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class KatanaService {

    constructor(private http: HttpClient,
        private toolService: ToolService,
        private courseService: CourseService,
        private router: Router,
        private toastService: ToastService) { }

    sockets: WebSocket[] = [];

    /*****************************************************************
     * Retrieves the list of tools from the server.
     * Process:
     * 1. Returns a promise
     * 2. Sends a GET request to the server for the tool list
     * 3. On success, sets the toolList property on the tools service to the response data
     ****************************************************************/
    getToolList() {
        return new Promise((resolve, reject) => {
            this.http.get('/tool-list').subscribe((toolList: any): any => {
                this.toolService.toolList = toolList;
                resolve();
            }, reject);
        });
    }

    /*****************************************************************
     * Retrieves...
     * Process:
     * 1. 
     ****************************************************************/
    getCourses(body) {
        return new Promise((resolve, reject) => {
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.post('/course-retrieval', body, { headers: headers }).subscribe(
                (data) => {
                    resolve(data);
                },
                (err) => {
                    this.toastService.toastError(err);
                    console.error(err);
                });
        });
    }

    /*****************************************************************
     * Runs a tool on the server in discovery mode, then returns the issue items discovered.
     * @param {string} toolId - The ID of the tool to be run
     * @param {object} options - An object containing the option values specific to the tool
     * @returns {object[]} - Array of issue items discovered by the tool on the server
     * Process:
     * 1. Returns a promise
     * 2. Builds the request object using the provided parameters
     * 3. Sends the request to the discovery URI
     * 4. When successful, sets the course service's courses to the new course objects with issueItems
     * 5. When unsuccessful, rejects the promise with the given error
     ****************************************************************/
    discoverIssues() {
        return new Promise((resolve, reject) => {
            this.courseService.courseEditOpen = false;
            this.toolService.processingMessage = 'Searching for Issues...';
            this.toolService.processing = true;
            var completed = 0;

            const socket = new WebSocket('ws://localhost:8000/tool/discover');
            this.sockets.push(socket);

            socket.addEventListener('open', (event) => {
                this.courseService.courses.forEach(course => {
                    course.processing = true;
                    let data = JSON.stringify({
                        tool_id: this.toolService.selectedTool.id,
                        course: course,
                        options: this.toolService.selectedDiscoverOptions
                    });
                    socket.send(data);
                });
            });

            socket.addEventListener('message', (event) => {

                let course = JSON.parse(event.data);
                if (course.error) {
                    console.error(`${course.course_code} (${course.id}): ${course.error}`);
                }
                this.courseService.coursesObj[`c${course.id}`] = course;
                course.processing = false;
                completed++;
                if (completed === 1) {
                    this.courseService.selectedCourse = this.courseService.courses[0];
                } else if (completed === this.courseService.courses.length) {
                    this.toolService.processing = false;
                    socket.close();
                }
            });

            socket.onerror = (err) => {
                this.toastService.toastError(err);
                this.toolService.processing = false;
                console.error(err);
            };
        });
    }

    /*****************************************************************
     * Fixes the provided issue items in Canvas by sending them to the specified tool on the server.
     * @param {string} toolId - The ID of the tool to be run
     * @param {object} options - An object containing the option values specific to the tool
     * @returns {object[]} - Array of issue items fixed by the tool on the server
     * Process:
     * 1. Returns a promise
     * 2. Builds the request object using the provided parameters
     * 3. Sends the request to the fix tool URI
     * 4. When successful, sets the courses property on the course service to the received courses
     * 5. When unsuccessful, rejects the promise with the given error
     ****************************************************************/
    fixIssues() {
        return new Promise((resolve, reject) => {
            this.courseService.courseEditOpen = false;
            this.toolService.processingMessage = 'Fixing Issues...';
            this.toolService.processing = true;

            var fixables = this.courseService.courses.filter(course => {
                return course.issueItems && course.issueItems.some(issueItems => {
                    if (issueItems.issues.some(issue => issue.status === 'approved')) {
                        course.processed = false;
                        return true;
                    } else {
                        course.processed = true;
                        return false;
                    }
                });
            });

            var completed = 0;

            const socket = new WebSocket('ws://localhost:8000/tool/fix');
            this.sockets.push(socket);

            socket.addEventListener('open', (event) => {
                fixables.forEach(course => {
                    course.processing = true;
                    let data = JSON.stringify({
                        tool_id: this.toolService.selectedTool.id,
                        course: course,
                        options: this.toolService.selectedDiscoverOptions
                    });
                    socket.send(data);
                });
            });

            socket.addEventListener('message', (event) => {
                let course = JSON.parse(event.data);
                if (course.error) {
                    console.error(`${course.course_code} (${course.id}): ${course.error}`);
                }
                this.courseService.coursesObj[`c${course.id}`] = course;
                course.processing = false;
                completed++;
                if (completed === 1) {
                    this.courseService.selectedCourse = this.courseService.courses[0];
                } else if (completed >= fixables.length) {
                    this.toolService.processing = false;
                    socket.close();
                }
            });

            socket.onerror = (err) => {
                this.toastService.toastError(err);
                this.toolService.processing = false;
                console.error(err);
            };
        });
    }
}
