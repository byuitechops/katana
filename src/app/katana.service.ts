import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseService } from './course.service';
import { ToolService, Tool } from './tool.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class KatanaService {

    constructor(private http: HttpClient,
        private toolsService: ToolService,
        private courseService: CourseService) { }

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
                this.toolsService.toolList = toolList;
                resolve();
            }, reject);
        });
    }

    /*****************************************************************
     * Retrieves...
     * Process:
     * 1. 
     ****************************************************************/
    getCourses() {
        return new Promise((resolve, reject) => {
            let body = {
                meta: 'tomato'
            };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.post('/course-retrieval', body, { headers: headers }).subscribe(
                (data) => {
                    resolve(data);
                },
                (err) => {
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
     * 4. When successful, resolves the promise with the data retrieved
     * 5. When unsuccessful, rejects the promise with the given error
     ****************************************************************/
    discoverIssues(tool_id: string, options: object) {
        return new Promise((resolve, reject) => {
            let body = {
                tool_id,
                courses: this.courseService.courses,
                options
            };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.post('/tool/discover', body, { headers: headers }).subscribe(resolve, reject);
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
     * 4. When successful, resolves the promise with the fixed items returned by the server
     * 5. When unsuccessful, rejects the promise with the given error
     ****************************************************************/
    fixIssues(tool_id: string, options: object) {
        return new Promise((resolve, reject) => {
            let body = {
                tool_id,
                issueItems: this.courseService.issueItems,
                options
            };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.put('/tool/fix', body, { headers: headers }).subscribe(resolve, reject);
        });
    }
}
