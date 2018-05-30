import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
    selector: 'app-issue-nav',
    templateUrl: './issue-nav.component.html',
    styleUrls: ['./issue-nav.component.css']
})
export class IssueNavComponent implements OnInit {

    constructor(private issuesService: IssuesService) { }

    ngOnInit() { }

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
        if (this.issuesService.selectedItem) {
            let courseIssueItems = this.issuesService.issueItems.filter(issueItem => issueItem.course_id === this.issuesService.selectedCourse.id);
            let currentIndex = courseIssueItems.findIndex(issueItem => this.issuesService.selectedItem === issueItem);
            if (direction === 'up' && currentIndex !== 0) {
                this.issuesService.selectedItem = courseIssueItems[currentIndex - 1];
            } else if (direction === 'down' && currentIndex !== courseIssueItems.length - 1) {
                this.issuesService.selectedItem = courseIssueItems[currentIndex + 1];
            }
        }
    }
}