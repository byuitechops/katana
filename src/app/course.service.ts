import { TEST_ISSUES } from './GENERATED_ISSUES';
import { Injectable } from '@angular/core';

export interface Course {
    id: number,
    course_name: string,
    course_code: string,
    instructor: string
}

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
export class CourseService {

    courses: Course[] = [{
        id: 123,
        course_name: 'Cow Surfing',
        course_code: 'B 383',
        instructor: 'Childers, Seth'
    }, {
        id: 456,
        course_name: 'Deforesting With Passion',
        course_code: 'CS 364',
        instructor: 'Williams, Zachary'
    }, {
        id: 789,
        course_name: 'Marx Brothers - A History',
        course_code: 'COMM 130',
        instructor: 'Dowdle-Sessions, Theron'
    }, {
        id: 342,
        course_name: 'How to Eat',
        course_code: 'AGBUS 300A',
        instructor: 'Earl, Benjamin'
    }];

    issueItems: IssueItem[] = TEST_ISSUES;

    _selectedCourse: Course = this.courses[0] || null;

    selectedItem: IssueItem = this.issueItems[0] || null;

    get selectedCourse() {
        return this._selectedCourse;
    }

    // This setter changes the selected item to the first item of the newly selected course
    set selectedCourse(course: Course) {
        if (course === this._selectedCourse || !course) return;
        this._selectedCourse = course;
        this.selectedItem = this.issueItems.find(issueItem => issueItem.course_id === course.id) || null;
    }

    constructor() { }

    /*****************************************************************
    * Adds a course to the list of currently selected courses.
    * @param {number} courseId - The ID of the course
    * @param {string} courseName - The full name of the course
    * @param {string} courseCode - The course code
    *****************************************************************/
    addCourse(courseId: number, courseName: string, courseCode: string, instructor: string = '') {

        // TODO Check to see if course already exists in the currently selected courses before adding it

        // TODO Add courses according to the format in courses_service.md

    }

    /*****************************************************************
    * Removes a course from the list of currently selected courses.
    * @param {number} courseId - The ID of the course
    *****************************************************************/
    removeCourse(courseId: number) {

        // TODO Use a regular for loop to break out of the search for the course as quick as possible

    }
}