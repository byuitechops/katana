import { TEST_ISSUES } from './GENERATED_ISSUES';
import { Injectable } from '@angular/core';

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

export interface Course {
    id: number,
    course_name: string,
    course_code: string,
    instructor: string,
    issueItems: IssueItem[],
    account?: string,
    term?: string
    blueprint?: boolean,
    url: string
}

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    courses = [
    //     {
    //     id: 13018,
    //     course_name: 'Katana 101',
    //     course_code: 'K 101',
    //     instructor: 'Seth Childers',
    //     issueItems: [],
    //     url: 'www.google.com'
    // }
    ];

    selectedIssueItem: IssueItem;
    _selectedCourse: Course;

    get selectedCourse() {
        return this._selectedCourse;
    }

    // This setter changes the selected item to the first item of the newly selected course
    set selectedCourse(course: Course) {
        if (course === this._selectedCourse || !course) return;
        this._selectedCourse = course;
        // this.selectedIssueItem = this._selectedCourse.issueItems.find(issueItem => issueItem.course_id === course.id) || null;
        this.selectedIssueItem = this._selectedCourse.issueItems ? this._selectedCourse.issueItems.find(issueItem => issueItem.course_id === course.id) : null;
    }

    constructor() { }

    /*****************************************************************
    * Adds a course to the list of currently selected courses.
    * @param {number} courseId - The ID of the course
    * @param {string} courseName - The full name of the course
    * @param {string} courseCode - The course code
    *****************************************************************/
    addCourse(course: Course) {

        // TODO Check to see if course already exists in the currently selected courses before adding it
        // TODO Add courses according to the format in courses_service.md
        let found = this.courses.find(existingCourse => existingCourse.id === course.id );
        
        if (!found) {
            this.courses.push(course);
        } 
        else {
            this.removeCourse(course);
        }
        
    }
    
    /*****************************************************************
     * Removes a course from the list of currently selected courses.
     * @param {number} courseId - The ID of the course
     *****************************************************************/
    removeCourse(course: Course) {
        
        // TODO Use a regular for loop to break out of the search for the course as quick as possible
        this.courses = this.courses.filter(currCourse => currCourse.id !== course.id );
    }
}