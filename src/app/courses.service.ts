import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    courses: object[] = [];

    constructor() { }

    /*****************************************************************
    * Adds a course to the list of currently selected courses.
    * @param {number} courseId - The ID of the course
    * @param {string} courseName - The full name of the course
    * @param {string} courseCode - The course code
    *****************************************************************/
    addCourse(courseId, courseName, courseCode) {

        // TODO Check to see if course already exists in the currently selected courses before adding it

        // TODO Add courses according to the format in courses_service.md

    }

    /*****************************************************************
    * Removes a course from the list of currently selected courses.
    * @param {number} courseId - The ID of the course
    *****************************************************************/
    removeCourse(courseId) {

        // TODO Use a regular for loop to break out of the search for the course as quick as possible

    }
}