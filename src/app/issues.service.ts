import { Injectable } from '@angular/core';
import { CoursesService, Course } from './courses.service';
import { TEST_ISSUES } from './GENERATED_ISSUES';

export interface Issue {
    title: string,
    status: string,
    description: string,
    details: object
}

export interface IssueItem {
    title: string,
    course_id: number,
    item_id: number,
    item_type: string,
    link: string,
    issues: Issue[]
}

@Injectable({
    providedIn: 'root'
})
export class IssuesService {

    // GENERATED_ISSUES is just a test file, and should be removed for production
    issueItems: IssueItem[] = TEST_ISSUES;

    _selectedCourse: Course = this.coursesService.courses[0] || null;

    selectedItem: IssueItem = this.issueItems[0] || null;

    get selectedCourse() {
        return this._selectedCourse;
    }

    set selectedCourse(course: Course) {
        if (course === this._selectedCourse) return;
        this._selectedCourse = course;
        this.selectedItem = this.issueItems.find(issueItem => issueItem.course_id === course.id) || null;
    }

    constructor(private coursesService: CoursesService) { }
}
