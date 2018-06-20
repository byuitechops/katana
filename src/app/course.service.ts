import { Injectable } from '@angular/core';

export interface Issue {
    title: string,
    status: string,
    display: string,
    details: object
}

export interface IssueItem {
    title: string,
    course_id: number,
    item_id: number,
    category: string,
    link: string,
    issues: Issue[]
}

export interface Course {
    id: number,
    course_name: string,
    course_code: string,
    instructor: string,
    issueItems: IssueItem[],
    url: string
    account?: string,
    term?: string
    blueprint?: boolean,
    processing?: boolean,
    error?: string,
}

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    coursesObj: object = {};
    _selectedCourse: Course;
    selectedIssueItem: IssueItem;
    courseSelectionOpen: boolean = false;
    courseEditOpen: boolean = false;

    get selectedCourse() {
        return this._selectedCourse;
    }

    // This setter changes the selected item to the first item of the newly selected course
    set selectedCourse(course: Course) {
        if (course === this._selectedCourse || !course) return;
        this._selectedCourse = course;
        this.selectedIssueItem = this._selectedCourse.issueItems ? this._selectedCourse.issueItems.find(issueItem => issueItem.course_id === course.id) : null;
    }

    get courses() {
        return Object.keys(this.coursesObj).reduce((acc, key) => [...acc, this.coursesObj[key]], []);
    }

    constructor() { }

    /*****************************************************************
    * Adds a course to the list of currently selected courses. This
    * will also add and remove them from the user's local storage.
    * @param {number} courseId - The ID of the course
    * @param {string} courseName - The full name of the course
    * @param {string} courseCode - The course code
    *****************************************************************/
    addCourse(course: Course) {
        if (!this.coursesObj[`c${course.id}`]) {
            if (!sessionStorage['katana_course' + course.id]) {
                sessionStorage['katana_course' + course.id] = JSON.stringify(course);
            }
            if (!course.issueItems) {
                course.issueItems = [];
            }
            this.coursesObj[`c${course.id}`] = course;
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
        if (sessionStorage['katana_course' + course.id]) {
            delete sessionStorage['katana_course' + course.id];
        }
        delete this.coursesObj[`c${course.id}`];
    }

    /*****************************************************************
     * Gets the count of issues under a given status for a single course.
     * Status is optional; returns total count if left blank.
     * @param {string} status - The status desired
     * @returns {number} - The number of issues with the specified status
     ****************************************************************/
    getCourseIssueCount(status) {
        if (this.selectedCourse) {
            return this.selectedCourse.issueItems.reduce((acc, issueItem) => {
                if (!status) {
                    return acc + issueItem.issues.length;
                }
                let issues = issueItem.issues.filter(issue => issue.status === status);
                return acc + issues.length;
            }, 0);
        }
    }

    /*****************************************************************
     * Gets the count of issues under a given status for all courses.
     * Status is optional; returns total count if left blank.
     * @param {string} status - The status desired
     * @returns {number} - The number of issues with the specified status
     ****************************************************************/
    getTotalIssuecount(status) {
        return this.courses.reduce((acc, course) => {
            return acc + this.getCourseIssueCount(status);
        }, 0);
    }
}