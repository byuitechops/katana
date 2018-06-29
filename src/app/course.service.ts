import { Injectable } from '@angular/core';
import { OptionModel } from './options.service';
import { FormGroup } from '@angular/forms';

export interface Issue {
    title: string,
    status: string,
    display: string,
    details: object,
    optionModel?: OptionModel,
    formGroup?: FormGroup,
    optionValues?: any,
    tempValues?: any
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
        // Set the selected course to a reference, so we don't have issues when updating the course objects
        this._selectedCourse = course;
        sessionStorage.selectedCourse = course.id;
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

    /***********************************************************************
     * This is used to determine the icon shown at the left of an issue on
     * a card. It is determined by the status of the icon. (i.e. "fixed")
     **********************************************************************/
    getStatusIcon(status) {
        let statusIcons = {
            'fixed': 'check_circle',
            'approved': 'check_circle_outline',
            'skipped': 'call_missed_outgoing',
            'untouched': 'panorama_fish_eye',
            'failed': 'warning'
        }
        return statusIcons[status];
    }

    /***********************************************************************
     * This is used to determine the icon color for the status icon of an
     * individual issue, as shown on an IssueItem card.
     **********************************************************************/
    getTextColorClasses(status) {
        let statusColors = {
            'fixed': 'blue-text text-accent-3',
            'approved': 'green-text text-accent-4',
            'skipped': 'blue-grey-text text-darken-2',
            'untouched': 'blue-grey-text text-lighten-4',
            'failed': 'red-text'
        }
        return statusColors[status];
    }

    /***********************************************************************
     * This is used to determine the background color for an issue card.
     **********************************************************************/
    getBackgroundColorClasses(status) {
        let statusColors = {
            'fixed': 'blue lighten-4',
            'approved': 'mint',
            'skipped': 'blue-grey lighten-4',
            'untouched': 'white',
            'failed': 'red lighten-5'
        }
        return statusColors[status];
    }
}