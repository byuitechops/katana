import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssuesService, IssueItem } from '../issues.service';

@Component({
    selector: 'app-issue-card',
    templateUrl: './issue-card.component.html',
    styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent implements OnInit {
    @Input() // Issue Item
    issueItem: IssueItem;
    @Input() // Card Position
    position: number;

    constructor(private issuesService: IssuesService) { }

    ngOnInit() { }

    getStatusIcon(status) {
        let statusIcons = {
            'fixed': 'check_circle',
            'approved': 'check_circle_outline',
            'skipped': 'remove',
            'untouched': 'panorama_fish_eye'
        }
        return statusIcons[status];
    }

    getIconColor(status) {
        let doc = getComputedStyle(document.body);
        let statusColors = {
            'fixed': doc.getPropertyValue('--accent-1'),
            'approved': '#00c853',
            'skipped': '#e53935',
            'untouched': doc.getPropertyValue('--primary-6')
        }
        return statusColors[status];
    }

}
