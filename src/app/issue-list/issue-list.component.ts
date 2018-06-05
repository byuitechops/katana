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

    verifyIssueCount() {
        if (this.courseService.selectedCourse) {
            return !this.courseService.selectedCourse.issueItems.some(issueItem => issueItem.course_id === this.courseService.selectedCourse.id);
        } else {
            return false;
        }
    }
}
