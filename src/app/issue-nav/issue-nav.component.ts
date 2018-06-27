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
        console.log(`downloadIssues`);
        let csvReport = '';
        this.courseService.courses.forEach((course, i) => {
            if (i < 1) {
                csvReport = csvFormatRows([[
                    "Title",
                    "Course ID",
                    "Item ID",
                    "Category",
                    "Link",
                    "Issues",
                ]].concat(course.issueItems.map(issueItem => {
                    let flatIssues = issueItem.issues.reduce((acc, issue) => acc.concat(JSON.stringify(issue)), []);
                    console.log(`flatIssues: `, flatIssues);
                    return [
                        issueItem.title,
                        issueItem.course_id,
                        issueItem.item_id,
                        issueItem.category,
                        issueItem.link,
                        ...flatIssues,
                    ];
                })));
            } else {
                // Make the log without the header
                csvReport += csvFormatRows(course.issueItems.map(issueItem => {
                    let flatIssues = issueItem.issues.reduce((acc, issue) => acc.concat(JSON.stringify(issue)), []);
                    console.log(`flatIssues: `, flatIssues);
                    return [
                        issueItem.title,
                        issueItem.course_id,
                        issueItem.item_id,
                        issueItem.category,
                        issueItem.link,
                        ...flatIssues,
                    ];
                })) + '\n';
            }
        });
        console.log(`csvReport: `, csvReport);
        let fileName = 'csvReport.csv';
        let a = <HTMLAnchorElement> document.getElementById("download");
        var blob = new Blob([csvReport], { type: "octet/stream" });
        var url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = fileName;
    }
}
