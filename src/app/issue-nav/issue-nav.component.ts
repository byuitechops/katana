import { Component } from '@angular/core';
import { CourseService } from '../course.service';
import { KatanaService } from '../katana.service';
import { MaterializeAction } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { ToolService } from '../tool.service';

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
        public katanaService: KatanaService) { }

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
