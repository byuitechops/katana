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

    getBorderColor() {
        let doc = getComputedStyle(document.body);
        let borderColors = {
            'fixed': doc.getPropertyValue('--accent-1'),
            'approved': '#00c853',
            'skipped': '#e53935',
            'untouched': doc.getPropertyValue('--primary-6')
        }
        return `solid 3px ${borderColors[this.issue.status]}`;
    }
}
