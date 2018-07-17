import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Used by the component's template, don't remove
import { CourseService } from '../../course.service';
import { KatanaService } from '../../katana.service';
import { MaterializeAction } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { ToolService } from '../../tool.service';
import { csvFormatRows } from 'd3-dsv';

/**
 * Container for managing various actions on the tool view page,
 * such as the "Fix All Approved" button.
 */
@Component({
    selector: 'app-issue-nav',
    templateUrl: './issue-nav.component.html',
    styleUrls: ['./issue-nav.component.css']
})
export class IssueNavComponent {

    /**
     * From [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize},
     * which allows the modal to open and close.
     */
    modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();

    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     * @param toolService Provides information and management for available tools.
     * @param katanaService Provides functionality to make API calls to the Katana server.
     * @param router Used to navigate the user as needed.
     */
    constructor(public courseService: CourseService,
        public toolService: ToolService,
        public katanaService: KatanaService,
        private router: Router) { }


    /**
     * Opens the modal using [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize}.
     */
    openModal() {
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }

    /**
     * Closes the modal using [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize}.
     */
    closeModal() {
        this.modalActions.emit({ action: "modal", params: ['close'] });
    }

    /**
     * Returns the user the {@link IssueItem}s belonging to the provided course.
     * @param course The course to retrieve the IssueItems from.
     * @returns {IssueItem[]} The IssueItems belonging to the provided course.
     */
    getIssueItems(course) {
        if (!course.issueItems) return [];
        return course.issueItems.reduce((acc, issueItem) => {
            if (!issueItem.issues) return acc;
            return [...acc, ...issueItem.issues];
        }, []);
    }

    /**
     * Sets the currently selected course and currently selected {@link IssueItem}.
     * @param course The course to set as the currently selected course.
     * @param issue The issue to use to set the currently selected IssueItem.
     */
    selectIssueItem(course, issue) {
        this.courseService.selectedCourse = course;
        this.courseService.selectedIssueItem = course.issueItems.find(issueItem => issueItem.issues.includes(issue));
        this.closeModal();
    }

    /**
     * Downloads a CSV to the user's computer containing all of the
     * currently displayed issues.
     */
    downloadIssues() {
        let csvReport = '';
        this.courseService.courses.forEach((course, i) => {
            course.issueItems.forEach((issueItem, j) => {
                if (i < 1 && j < 1) {
                    csvReport = csvFormatRows([[
                        "Issue Title",
                        "Status",
                        "Option Values",
                        "Item Title",
                        "Item ID",
                        "Course ID",
                        "Category",
                        "Link",
                        "Details",
                    ]].concat(issueItem.issues.map(issue => {
                        var flatIssueDetails = Object.entries(issue.details).reduce((acc, pair) => {
                            var detail = `${pair[0]}: ${pair[1]}`;
                            return acc.concat(detail);
                        }, []);

                        return [
                            issue.title,
                            issue.status,
                            issue.optionValues ? issue.optionValues : '',
                            issueItem.title,
                            issueItem.item_id,
                            issueItem.course_id,
                            issueItem.category,
                            issueItem.link,
                            ...flatIssueDetails
                        ];
                    }))) + '\n';
                } else {
                    // Make the log without the header
                    csvReport += csvFormatRows(issueItem.issues.map(issue => {
                        var flatIssueDetails = Object.entries(issue.details).reduce((acc, pair) => {
                            var detail = `${pair[0]}: ${pair[1]}`;
                            return acc.concat(detail);
                        }, []);
                        return [
                            issue.title,
                            issue.status,
                            issue.optionValues ? issue.optionValues : '',
                            issueItem.title,
                            issueItem.item_id,
                            issueItem.course_id,
                            issueItem.category,
                            issueItem.link,
                            ...flatIssueDetails
                        ];
                    })) + '\n';
                }
            });
        });

        // Setup the link to download the csv report
        let fileName = 'csvReport.csv';
        let a = <HTMLAnchorElement>document.getElementById("download");
        var blob = new Blob([csvReport], { type: "octet/stream" });
        var url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = fileName;
    }
}