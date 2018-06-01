import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoursesService, Course } from './courses.service';
import { IssuesService, IssueItem } from './issues.service';

@Injectable({
    providedIn: 'root'
})

export class KatanaService {

    constructor(private http: HttpClient,
        private coursesService: CoursesService,
        private issuesService: IssuesService) { }

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
                courses: this.coursesService.courses,
                options
            };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.post('/tool/discovery', body, { headers: headers }).subscribe(resolve, reject);
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
                issueItems: this.issuesService.issueItems,
                options
            };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            headers.append('Content-Type', 'application/json');
            this.http.put('/tool/fix', body, { headers: headers }).subscribe(resolve, reject);
        });
    }
}
