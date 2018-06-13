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
                    this.toolService.processing = false;
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
            this.toolService.processingMessage = 'Discovering Issues...';
            this.toolService.processing = true;
            let body = {
                tool_id: this.toolService.selectedTool.id,
                courses: this.courseService.courses,
                options: this.toolService.selectedDiscoverOptions
            };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.post('/tool/discover', body, { headers: headers }).subscribe(
                (courses: Course[]) => {
                    this.courseService.courses = courses;
                    this.courseService.selectedCourse = courses[0];
                    this.toolService.processing = false;
                    resolve();
                },
                (err) => {
                    this.toolService.processing = false;
                    this.toastService.toastError(err);
                    console.error(err);
                    this.router.navigate(['/']);
                });
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
            this.toolService.processingMessage = 'Fixing Issues...';
            this.toolService.processing = true;
            let body = {
                tool_id: this.toolService.selectedTool.id,
                courses: this.courseService.courses,
                options: this.toolService.selectedDiscoverOptions
            };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.put('/tool/fix', body, { headers: headers }).subscribe(
                (courses: Course[]) => {
                    console.log(courses);
                    this.courseService.courses = courses;
                    this.courseService.selectedCourse = courses[0];
                    this.toolService.processing = false;
                    resolve();
                },
                (err) => {
                    this.toolService.processing = false;
                    this.toastService.toastError(err);
                    console.error(err);
                });
        });
    }
}
