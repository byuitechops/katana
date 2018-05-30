import { Component, OnInit, Input } from '@angular/core';
import { Issue } from '../issues.service';

@Component({
    selector: 'app-issue-container',
    templateUrl: './issue-container.component.html',
    styleUrls: ['./issue-container.component.css']
})
export class IssueContainerComponent implements OnInit {
    @Input() // Issue
    issue: Issue;

    constructor() { }

    ngOnInit() {

    }

    setIssueStatus(newStatus) {
        if (newStatus === this.issue.status) {
            this.issue.status = 'untouched';
        } else {
            this.issue.status = newStatus;
        }
    }

}
