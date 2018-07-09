import { Injectable } from '@angular/core';
import { OptionModel } from './options.service';
import { FormGroup } from '@angular/forms';

/** Represents a single issue in an {@link IssueItem}. */
export interface Issue {
    /** The title of the issue */
    title: string,
    /** The status of the issue (untouched, approved, skipped, fixed, failed) */
    status: string,
    /** The HTML string used to display the contents of the issue in its {@link IssueContainerComponent} */
    display: string,
    /** An object containing issue-specific details */
    details: object,
    /** The {@link OptionModel} used to generated any {@link FixOption}s used by the tool */
    optionModel?: OptionModel,
    /** The {@link FormGroup} generated for the issue's {@link FixOption}s */
    formGroup?: FormGroup,
    /** The results of form generated by the above {@link OptionModel} */
    optionValues?: any,
    /** Used to store the current state of the form to restore it on page reload */
    tempValues?: any
}

/** Represents an item in Canvas, such as a page or quiz. */
export interface IssueItem {
    /** The title of the item in Canvas */
    title: string,
    /** The course ID the item belongs to in Canvas */
    course_id: number,
    /** The content ID of the item in Canvas */
    item_id: number,
    /** The category the item belongs to (pages, quizzes, moduleItems, etc.) */
    category: string,
    /** Link to view the item in Canvas */
    link: string,
    /** {@link Issue}s discovered by a tool within this item */
    issues: Issue[]
}

/** Represents a single course */
export interface Course {
    /** The course's ID in Canvas */
    id: number,
    /** The name of the course in Canvas */
    course_name: string,
    /** The code for the course in Canvas */
    course_code: string,
    /** The current instructor for the course */
    instructor: string,
    /** The {@link IssueItem}s for this course */
    issueItems: IssueItem[],
    /** URL to the course in Canvas */
    url: string
    /** The sub-account the course is under in Canvas */
    account?: string,
    /** The term the course is set to in Canvas */
    term?: string
    /** Whether or not the course is a Blueprint course */
    blueprint?: boolean,
    /** Whether the course is currently be processed through a tool */
    processing?: boolean,
    /** If an error is returned by a tool, it is attached to the course here */
    error?: string,
}

/**
 * Provides information and management for a variety of things, but mainly the
 * courses the user selects via the {@link CourseSelectionComponent}. Also provides
 * functionality for styling and counts based on {@link Course}s' {@link IssueItem}s.
 */
@Injectable({
    providedIn: 'root'
})
export class CourseService {

    /**
     * Holds all of the currently selected {@link Course}s.
     */
    coursesObj: object = {};

    /**
     * The currently selected {@link Course}.
     */
    _selectedCourse: Course;

    /**
     * The currently selected {@link IssueItem}.
     */
    selectedIssueItem: IssueItem;

    /**
     * Whether or not the {@link CourseSelectionComponent} is open.
     */
    courseSelectionOpen: boolean = false;

    get selectedCourse() {
        return this._selectedCourse;
    }

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

    /**
     * Constructor
     */
    constructor() { }

    /**
    * Adds a course to the list of currently selected courses. This
    * will also add and remove them from the user's local storage.
    * @param {number} courseId - The ID of the course
    * @param {string} courseName - The full name of the course
    * @param {string} courseCode - The course code
    */
    addCourse(course: Course): void {
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

    /**
     * Removes a course from the list of currently selected courses.
     * @param {number} courseId - The ID of the course
     */
    removeCourse(course: Course): void {
        if (sessionStorage['katana_course' + course.id]) {
            delete sessionStorage['katana_course' + course.id];
        }
        delete this.coursesObj[`c${course.id}`];
    }

    /**
     * Gets the count of issues under a given status for a single course.
     * Status is optional; returns total count if left blank.
     * @param {string} status - The status desired
     * @returns {number} - The number of issues with the specified status
     */
    getCourseIssueCount(status): number {
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

    /**
     * Gets the count of issues under a given status for all courses.
     * Status is optional; returns total count if left blank.
     * @param {string} status - The status desired
     * @returns {number} - The number of issues with the specified status
     */
    getTotalIssueCount(status): number {
        return this.courses.reduce((acc, course) => {
            return acc + this.getCourseIssueCount(status);
        }, 0);
    }

    /**
     * This is used to determine the icon shown at the left of an issue on
     * a card. It is determined by the status of the icon. (i.e. "fixed")
     * @param {string} [status] The status of the issue.
     * @returns {string} The text used to display the icon.
     */
    getStatusIcon(status): string {
        let statusIcons = {
            'fixed': 'check_circle',
            'approved': 'check_circle_outline',
            'skipped': 'call_missed_outgoing',
            'untouched': 'panorama_fish_eye',
            'failed': 'warning'
        }
        return statusIcons[status];
    }

    /**
     * This is used to determine the icon color for the status icon of an
     * individual issue, as shown on an IssueItem card.
     * @param {string} [status] The status of the issue.
     * @returns {string} The classes to apply to the element.
     */
    getTextColorClasses(status): string {
        let statusColors = {
            'fixed': 'blue-text text-accent-3',
            'approved': 'green-text text-accent-4',
            'skipped': 'blue-grey-text text-darken-2',
            'untouched': 'blue-grey-text text-lighten-4',
            'failed': 'red-text'
        }
        return statusColors[status];
    }

    /**
     * This is used to determine the background color for an issue card.
     * @param {string} [status] The status of the issue.
     * @returns {string} The classes to apply to the element.
     */
    getBackgroundColorClasses(status): string {
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