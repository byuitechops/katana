import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    // courses: object[] = [];

    courses = [{
        id: 123,
        course_name: 'Cow Surfing',
        course_code: 'B 383'
    }, {
        id: 456,
        course_name: 'Deforesting With Passion',
        course_code: 'CS 364'
    }, {
        id: 789,
        course_name: 'Marx Brothers - A History',
        course_code: 'COMM 130'
    }];

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