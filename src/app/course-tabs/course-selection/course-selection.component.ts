import { Component, ViewChild, ElementRef } from '@angular/core';
import { KatanaService } from '../../katana.service';
import { CourseService } from '../../course.service';
import { Course } from '../../interfaces';

/**
 * Provides the user management for the selected courses, including a course search.
 * overlay to add/remove courses.
 */
@Component({
    selector: 'app-course-selection',
    templateUrl: './course-selection.component.html',
    styleUrls: ['./course-selection.component.css']
})
export class CourseSelectionComponent {
    /** Element reference to the sub-account filter input. */
    @ViewChild('subAccount') private subAccount: ElementRef;
    /** Element reference to the term filter input. */
    @ViewChild('term') private term: ElementRef;
    /** Element reference to the blueprint filter input. */
    @ViewChild('blueprint') private blueprint: ElementRef;
    /** Element reference to the search-by filter input. */
    @ViewChild('searchBy') private searchBy: ElementRef;
    /** Element reference to the search text input. */
    @ViewChild('searchText') private searchText: ElementRef;

    /** Whether or not a search is currently processing */
    searching = false;

    /** Holds what the last search was sorted by. */
    lastSortedBy: string;

    /** Results of a search. */
    courseResults: Course[] = [];

    /**
     * Constructor
     * @param {KatanaService} katanaService Provides functionality for making API calls to the Katana server.
     * @param {CourseService} courseService Provides information and management for selected courses.
     */
    constructor(private katanaService: KatanaService,
        public courseService: CourseService) { }

    /**
     * This retrieves all courses that match the given parameters from Canvas 
     * and returns them as an array of course objects that have been modified 
     * by us. The returned results will populate the 'courseResults' array and 
     * will display in the results table in the course-selection html file.
     */
    async getCourses() {
        // Canvas makes you have an input of at least three characters to use the search_term in the API
        if (this.searchText.nativeElement.value.length > 2) {

            // Replace any whitespaces with '%20' for the query parameter and make everything lowercase
            const searchPhrase = this.searchText.nativeElement.value.replace(/\s/g, '%20');
            // Set the loading circle to display before retrieving the courses
            this.searching = true;

            // Send the search parameters to the katana service to build the correct URI
            this.katanaService.getCourses({
                subAccount: this.subAccount.nativeElement.value,
                term: this.term.nativeElement.value,
                blueprint: this.blueprint.nativeElement.value,
                searchPhrase: searchPhrase,
                searchBy: this.searchBy.nativeElement.value
            })
                /* After getting the courses from Canvas, check to make sure what you
                got back matches what is currently in the search text input box */
                .then((courses: Course[]) => {
                    if (searchPhrase === this.searchText.nativeElement.value.replace(/\s/g, '%20')) {
                        this.searching = false;
                        this.courseResults = courses;
                    }
                })
                .catch(console.error);
        } else {
            /* If the string in the search box is less than three characters
            then stop searching and set the returned course results to an empty array
            instead of leaving the last results in the table */
            this.searching = false;
            this.courseResults = [];
        }
    }

    /**
     * Sorts the courseResults array according to the course attribute defined by 'param'.
     * @param {string} param The object key to be sorted.
     * @returns {void}
     */
    sortBy(param: any) {
        // If they click on the same category more than once, it will reverse the order of the results
        if (this.lastSortedBy === param) {
            this.courseResults = this.courseResults.reverse();
            this.lastSortedBy = param;
            return;
        }

        this.lastSortedBy = param;
        // Sort numerically
        if (param === 'id' || param === 'account' || param === 'blueprint') {
            this.courseResults.sort((a, b) => {
                return a[param] - b[param];
            });
        } else {
            // Sort alphabetically
            this.courseResults.sort((a, b) => {
                const name1 = a[param].toLowerCase();
                const name2 = b[param].toLowerCase();
                if (name1 < name2) {
                    return -1;
                }
                if (name1 > name2) {
                    return 1;
                }
                return 0;
            });
        }
    }

    /**
     * Checks to see if the selected course from courseResults
     * is already in the courses array in courseService.
     * @param {object} course The course that is being checked.
     * @returns {boolean} Whether the course is already added.
     */
    isAdded(course: any) {
        return this.courseService.courses.find(c => c.id === course.id) !== undefined;
    }

    /** Deselects all selected courses. */
    removeAll() {
        this.courseService.courses.forEach(c => this.courseService.removeCourse(c));
    }

    /** Selects all courses found in the search */
    addAll() {
        this.courseResults.forEach(c => {
            if (!this.isAdded(c)) {
                this.courseService.addCourse(c);
            }
        });
    }

    /** Closes the courseSelect page when the user clicks on the margins of the page */
    closeCourseSelect() {
        this.courseService.courseSelectionOpen = false;
    }

    /** Stops the courseSelect page from closing when the user interacts with the page (area that is not in the margins) 
     * @param {object} event The JS onClick event
     */
    stopEvent(event) {
        event.stopPropagation();
    }
}
