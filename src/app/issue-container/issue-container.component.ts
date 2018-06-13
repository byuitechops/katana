import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Issue } from '../course.service';

@Component({
    selector: 'app-issue-container',
    templateUrl: './issue-container.component.html',
    styleUrls: ['./issue-container.component.css']
})
export class IssueContainerComponent implements OnInit {
    @Input() // Issue
    issue: Issue;
    @ViewChild('issueDetails') issueDetails: ElementRef;

    constructor() { }

    ngOnInit() {
        this.issueDetails.nativeElement.innerHTML = this.issue.display;
    }

    setIssueStatus(newStatus) {
        if (this.issue.status === 'fixed') {
            return;
        } else if (newStatus === this.issue.status) {
            this.issue.status = 'untouched';
        } else {
            this.issue.status = newStatus;
        }
    }

    getButtonClasses(desiredStatus: string, elType: string) {
        let classes = '';
        if (elType === 'button') {
            classes += 'waves-effect waves btn-flat';
        }
        if (this.issue.status !== 'untouched' && this.issue.status !== desiredStatus) {
            classes += ' text-lighten-4';
        } else if (desiredStatus === 'approved') {
            classes += ' text-accent-4';
        }
        return classes;
    }

    getBorderColor() {
        let doc = getComputedStyle(document.body);
        let borderColors = {
            'fixed': doc.getPropertyValue('--accent-1'),
            'approved': '#00c853',
            'skipped': '#e53935',
            'untouched': doc.getPropertyValue('--primary-6')
        }
        return `solid 5px ${borderColors[this.issue.status]}`;
    }
}
