import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Used by the component's template, don't remove
import { CourseService } from '../course.service';
import { KatanaService } from '../katana.service';
import { MaterializeAction } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { ToolService } from '../tool.service';
import { csvFormatRows } from 'd3-dsv';

@Component({
    selector: 'app-issue-nav',
    templateUrl: './issue-nav.component.html',
    styleUrls: ['./issue-nav.component.css']
})
export class IssueNavComponent {

    selectedModal: string = 'approveAll';

    // This allows the modal to open and close
    modalActions = new EventEmitter<string | MaterializeAction>();

    constructor(public courseService: CourseService,
        public toolService: ToolService,
        public katanaService: KatanaService,
        private router: Router) { }

    getModal() {
        return this.selectedModal;
    }

    /*****************************************************************
     * Opens and closes the modal. Populates the modal based on the input.
     * @param {string} contentKey - Should match one of the keys of the modalContents property on this component
     ****************************************************************/
    openModal(modalName) {
        this.selectedModal = modalName;
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }
    closeModal() {
        this.modalActions.emit({ action: "modal", params: ['close'] });
    }

    /*****************************************************************
     * Approves all issues for the course to be fixed if possible, ignoring skipped and fixed items.
     * @param {string} newStatus - Either 'approved' or 'unapproved', determines the new status
     * Process:
     * 1. For each issue items, get its issues
     * 2. For each issue on the issue item, see if it is skipped or fixed
     * 3. If not, set it's status to approved
     ****************************************************************/
    setApproved(newStatus: string) {
        this.courseService.selectedCourse.issueItems.forEach(issueItem => {
            issueItem.issues.forEach(issue => {
                if (newStatus === 'approved' && issue.status === 'untouched') {
                    issue.status = newStatus;
                } else if (newStatus === 'untouched' && issue.status === 'approved') {
                    issue.status = newStatus;
                }
            });
        });
    }

    getIssueItems(course) {
        if (!course.issueItems) return [];
        return course.issueItems.reduce((acc, issueItem) => {
            if (!issueItem.issues) return acc;
            return [...acc, ...issueItem.issues];
        }, []);
    }

    selectIssueItem(course, issue) {
        this.courseService.selectedCourse = course;
        this.courseService.selectedIssueItem = course.issueItems.find(issueItem => issueItem.issues.includes(issue));
        this.closeModal();
    }

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