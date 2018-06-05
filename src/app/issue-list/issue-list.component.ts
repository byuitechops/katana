import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';

@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css']
})

export class IssueListComponent implements OnInit {

    constructor(public courseService: CourseService) { }

    ngOnInit() {

    }
}
