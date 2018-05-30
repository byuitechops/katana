import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-issue-container',
    templateUrl: './issue-container.component.html',
    styleUrls: ['./issue-container.component.css']
})
export class IssueContainerComponent implements OnInit {
    @Input() // Issue
    issue: object;

    constructor() { }

    ngOnInit() {

    }

}
