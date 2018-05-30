import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoursesService, Course } from './courses.service';
import { IssuesService, IssueItem } from './issues.service';

@Injectable({
    providedIn: 'root'
})

export class KatanaService {

    constructor(private http: HttpClient) { }

    /*****************************************************************
     * Runs a tool on the server in discovery mode, then returns the issue items discovered.
     * @param {string} toolId - The ID of the tool to be run
     * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
     * @param {object} options - An object containing the option values specific to the tool
     * @returns {object[]} - Array of issue items discovered by the tool on the server
     * Process:
     * 1. Returns a promise
     * 2. Builds the request object using the provided parameters
     * 3. Sends the request to the discovery URI
     * 4. When successful, resolves the promise with the data retrieved
     * 5. When unsuccessful, rejects the promise with the given error
     ****************************************************************/
    discoverIssues(tool_id: string, courses: Course[], options: object) {
        return new Promise((resolve, reject) => {
            let body = {
                tool_id,
                courses,
                options
            };
            this.http.post('/tool/discovery', body).subscribe(resolve, reject);
        });
    }

    /*****************************************************************
     * Fixes the provided issue items in Canvas by sending them to the specified tool on the server.
     * @param {string} toolId - The ID of the tool to be run
     * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
     * @param {object} options - An object containing the option values specific to the tool
     * @param {object[]} issueItems - Array of issue items to be fixed by the specified tool
     * @returns {object[]} - Array of issue items fixed by the tool on the server
     * Process:
     * 1. Returns a promise
     * 2. Builds the request object using the provided parameters
     * 3. Sends the request to the fix tool URI
     * 4. When successful, resolves the promise with the fixed items returned by the server
     * 5. When unsuccessful, rejects the promise with the given error
     ****************************************************************/
    fixIssues(tool_id: string, issueItems: IssueItem[], options: object) {
        return new Promise((resolve, reject) => {
            let body = {
                tool_id,
                issueItems,
                options
            };
            this.http.put('/tool/fix', body).subscribe(resolve, reject);
        });
    }
}
