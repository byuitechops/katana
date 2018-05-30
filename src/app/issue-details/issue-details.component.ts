import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
    selector: 'app-issue-details',
    templateUrl: './issue-details.component.html',
    styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {

    constructor(private issuesService: IssuesService) { }

    ngOnInit() {
    }

}
