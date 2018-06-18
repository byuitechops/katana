import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { KatanaService } from '../katana.service';
import { Course, CourseService } from '../course.service';

@Component({
    selector: 'app-course-selection',
    templateUrl: './course-selection.component.html',
    styleUrls: ['./course-selection.component.css']
})
export class CourseSelectionComponent implements AfterViewInit {
    @ViewChild('subAccount') private subAccount: ElementRef;
    @ViewChild('term') private term: ElementRef;
    @ViewChild('blueprint') private blueprint: ElementRef;
    @ViewChild('searchText') private searchText: ElementRef;
    @ViewChild('searchBy') private searchBy: ElementRef;

    searching: boolean = false;
    lastSortedBy: string;

    courseResults: Course[] = [{
        id: 1318,
        course_name: 'Example Course 123',
        course_code: 'E123',
        instructor: 'Katana Jones',
        issueItems: [],
        account: '3',
        term: 'Fall 2018',
        url: 'www.google.com',
        blueprint: false
    }];

    constructor(private katanaService: KatanaService,
        public courseService: CourseService) { }

    /*************************************************************************
     * This retrieves all courses that match the given parameters from Canvas 
     * and returns them as an array of course objects that have been modified 
     * by us. The returned results will populate the 'courseResults' array and 
     * will display in the results table in the course-selection html file.
     *************************************************************************/
    async getCourses() {
        /* Canvas makes you have an input of at least three characters to use the search_term in the API */
        if (this.searchText.nativeElement.value.length > 2) {

            /* Replace any whitespaces with '%20' for the query parameter */
            var searchText = this.searchText.nativeElement.value.replace(/\s/g, '%20');

            /* Set the loading circle to display before retrieving the courses */
            this.searching = true;

            /* Send the search parameters to the katana service to build the correct URI */
            this.katanaService.getCourses({
                subAccount: this.subAccount.nativeElement.value,
                term: this.term.nativeElement.value,
                blueprint: this.blueprint.nativeElement.value,
                searchText: searchText,
                searchBy: this.searchBy.nativeElement.value
            })
                /* After getting the courses from Canvas, check to make sure what you 
                got back matches what is currently in the search text input box */
                .then((courses: Course[]) => {
                    if (searchText === this.searchText.nativeElement.value.replace(/\s/g, '%20')) {
                        this.searching = false;
                        this.courseResults = courses;
                    }
                })
                .catch(console.error);
        }
    }

    /******************************************************************
     * Sorts the courseResults array according to the 
     * course attribute defined by 'param'
     * @param {string} param - The object key to be sorted
     * @returns {number} - The new position of the object in the array
     ******************************************************************/
    sortBy(param) {
        /* If they click on the same category more than once, it will reverse the order of the results */
        if (this.lastSortedBy === param) {
            this.courseResults = this.courseResults.reverse();
            this.lastSortedBy = param;
            return;
        }

        this.lastSortedBy = param;
        /* Sort numerically */
        if (param === 'id' || param === 'account' || param === 'blueprint') {
            this.courseResults.sort((a, b) => {
                return a[param] - b[param];
            });
        } else {
            /* Sort alphabetically */
            this.courseResults.sort((a, b) => {
                let name1 = a[param].toUpperCase();
                let name2 = b[param].toUpperCase();
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

    /************************************************************
     * Checks to see if the selected course from courseResults
     * is already in the courses array in courseService.
     * @param {object} course - The course that is being checked
     * @returns {boolean} - Whether the course is already added
     ************************************************************/
    isAdded(course) {
        return this.courseService.courses.find(c => c.id === course.id) !== undefined;
    }

    ngAfterViewInit() { }
}
