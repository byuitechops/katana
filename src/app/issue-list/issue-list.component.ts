import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {

    constructor(private issuesService: IssuesService) { }

    ngOnInit() {

    }

    verifyIssueCount() {
        if (this.issuesService.selectedCourse) {
            return !this.issuesService.issueItems.some(issueItem => issueItem.course_id === this.issuesService.selectedCourse.id);
        } else {
            return false;
        }
    }
}
