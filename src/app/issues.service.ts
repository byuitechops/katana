import { Injectable } from '@angular/core';
import { CoursesService } from './courses.service';
import { TEST_ISSUES } from './GENERATED_ISSUES';

@Injectable({
    providedIn: 'root'
})
export class IssuesService {

    // GENERATED_ISSUES is just a test file, and should be removed for production
    issueItems = TEST_ISSUES;

    _selectedCourse: object = this.coursesService.courses[0] || {};
    selectedItem: object = this.issueItems[0] || {};

    get selectedCourse() {
        return this._selectedCourse;
    }

    set selectedCourse(course: object) {
        if (course === this._selectedCourse) return;
        this._selectedCourse = course;
        this.selectedItem = this.issueItems.find(issueItem => issueItem.course_id === course.id) || {};
    }

    constructor(private coursesService: CoursesService) { }
}
