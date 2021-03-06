import { Injectable, EventEmitter } from '@angular/core';
import { Course, ItemCard } from './interfaces';

/**
 * Provides information and management for a variety of things, but mainly the
 * courses the user selects via the {@link CourseSelectionComponent}. Also provides
 * functionality for styling and counts based on {@link Course}s' {@link ItemCard}s.
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
    private _selectedCourse: Course;

    /**
     * The currently selected {@link ItemCard}.
     */
    selectedItemCard: ItemCard;

    /**
     * Whether or not the {@link CourseSelectionComponent} is open.
     */
    courseSelectionOpen = false;

    /**
     * Emits when a the selected course has changed. Used by lazy-loading components.
     */
    courseChange = new EventEmitter<Course>();

    get selectedCourse() {
        return this._selectedCourse;
    }

    set selectedCourse(course: Course) {
        if (course === this._selectedCourse || !course) { return; }
        // Set the selected course to a reference, so we don't have issues when updating the course objects
        this._selectedCourse = course;
        this.courseChange.emit(this._selectedCourse);
        this.selectedItemCard = this._selectedCourse.itemCards ? this._selectedCourse.itemCards.find(itemCard => itemCard.course_id === course.id) : null;
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
            if (!course.itemCards) {
                course.itemCards = [];
            }
            this.coursesObj[`c${course.id}`] = course;
        } else {
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
            return this.selectedCourse.itemCards.reduce((acc, itemCard) => {
                if (!status) {
                    return acc + itemCard.issues.length;
                }
                const issues = itemCard.issues.filter(issue => issue.status === status);
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
        return this.courses.reduce(acc => {
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
        const statusIcons = {
            'fixed': 'check_circle',
            'approved': 'check_circle_outline',
            'skipped': 'call_missed_outgoing',
            'untouched': 'panorama_fish_eye',
            'failed': 'warning'
        };
        return statusIcons[status];
    }

    /**
     * This is used to determine the icon color for the status icon of an
     * individual issue, as shown on an ItemCard card.
     * @param {string} [status] The status of the issue.
     * @returns {string} The classes to apply to the element.
     */
    getTextColorClasses(status): string {
        const statusColors = {
            'fixed': 'blue-text text-accent-3',
            'approved': 'green-text text-accent-4',
            'skipped': 'blue-grey-text text-darken-2',
            'untouched': 'blue-grey-text text-lighten-4',
            'failed': 'red-text'
        };
        return statusColors[status];
    }

    /**
     * This is used to determine the background color for an issue card.
     * @param {string} [status] The status of the issue.
     * @returns {string} The classes to apply to the element.
     */
    getBackgroundColorClasses(status): string {
        const statusColors = {
            'fixed': 'blue lighten-4',
            'approved': 'mint',
            'skipped': 'blue-grey lighten-4',
            'untouched': 'white',
            'failed': 'red lighten-5'
        };
        return statusColors[status];
    }
}
