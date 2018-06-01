import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';

@Component({
    selector: 'app-issue-details',
    templateUrl: './issue-details.component.html',
    styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent implements OnInit {

    constructor(public courseService: CourseService) { }

    ngOnInit() {
    }

}
