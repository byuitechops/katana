import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { KatanaService } from '../katana.service';
import { MaterializeAction } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { ToolService, Tool } from '../tool.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-issue-nav',
    templateUrl: './issue-nav.component.html',
    styleUrls: ['./issue-nav.component.css']
})
export class IssueNavComponent implements OnInit {

    selectedModal: string = 'approveAll';

    // This allows the modal to open and close
    modalActions = new EventEmitter<string | MaterializeAction>();

    constructor(public courseService: CourseService,
        public toolService: ToolService,
        public katanaService: KatanaService,
        private router: Router) { }

    ngOnInit() { }

    getModal() {
        return this.selectedModal;
    }

    /*****************************************************************
     * Opens and closes the modal. Populates the modal based on the input.
     * @param {string} contentKey - Should match one of the keys of the modalContents property on this component
     * Process:
     * 1. Sets the contents of the modal based on the provided contentKey
     * 2. Emits the "open" event for the modal (or close, for the close method)
     ****************************************************************/
    openModal(modalName) {
        this.selectedModal = modalName;
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }
    closeModal() {
        this.modalActions.emit({ action: "modal", params: ['close'] });
    }

    /*****************************************************************
     * Switches the selected card and item to the one below or above the currently selected card
     * @param {string} direction - Either "up" or "down", indicates the direction it should shift
     * Process:
     * 1. Check if we have selected item (should always be one, and if there is one, then a course is selected)
     * 2. Get the list of issues for the currently selected course
     * 3. Get the index of the currently selected issue item in the array retreived in step 2
     * 4. If direction is up and we aren't on index 0, set the selected item to the one above
     * 5. If direction is down and we aren't on the last index, set the selected item to the one below
     ****************************************************************/
    shiftSelectedItem(direction: string) {
        if (this.courseService.selectedIssueItem) {
            let courseIssueItems = this.courseService.selectedCourse.issueItems.filter(issueItem => issueItem.course_id === this.courseService.selectedCourse.id);
            let currentIndex = courseIssueItems.findIndex(issueItem => this.courseService.selectedIssueItem === issueItem);
            if (direction === 'up' && currentIndex !== 0) {
                this.courseService.selectedIssueItem = courseIssueItems[currentIndex - 1];
            } else if (direction === 'down' && currentIndex !== courseIssueItems.length - 1) {
                this.courseService.selectedIssueItem = courseIssueItems[currentIndex + 1];
            }
        }
    }

    /*****************************************************************
     * Returns the position of the currently selected card. This is for the issue item counter.
     * @returns {object} - The index of the currently selected card and the total number of issue items for the currently selected course
     * Process:
     * 1. Retrieves issues for the currently selected course
     * 2. Finds the index of the issue item related to the currently selected card
     * 3. Returns the index + 1 and the total length of the array of cards for the currently selected course
     ****************************************************************/
    getCardPosition() {
        let currentIndex = this.courseService.selectedCourse.issueItems.findIndex(issueItem => issueItem === this.courseService.selectedIssueItem);
        return {
            currentIndex: currentIndex + 1,
            totalLength: this.courseService.selectedCourse.issueItems.length
        }
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
}
