import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { KatanaService } from '../katana.service';
import { Course, CourseService } from '../course.service';

@Component({
    selector: 'app-course-selection',
    templateUrl: './course-selection.component.html',
    styleUrls: ['./course-selection.component.css']
})
export class CourseSelectionComponent {
    @ViewChild('account') private account: ElementRef;
    @ViewChild('term') private term: ElementRef;
    @ViewChild('blueprint') private blueprint: ElementRef;
    @ViewChild('searchText') private searchText: ElementRef;

    courseResults: Course[] = [
    {
        id: 1318,
        course_name: 'Katana 10',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    },    {
        id: 1301,
        course_name: 'Katana 11',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: true
    },    {
        id: 3018,
        course_name: 'Katana 01',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, 
];

    constructor(private katanaService: KatanaService,
        public courseService: CourseService) { }

    toggleSelected(course) {
        // var found = this.courseService.courses.find(currCourse => currCourse.id === course.id );
        // let button = document.querySelector("tbody>tr>td>i").innerHTML;
        // if (button === "add_circle") {
        //     document.querySelector("tbody>tr>td>i").innerHTML = "remove_circle";
        // } else if (button === "remove_circle") {
        //     document.querySelector("tbody>tr>td>i").innerHTML = "add_circle";
        // }
    }

    async getCourses() {
        // let textInput = this.searchText.nativeElement.value.replace(/\s/g, '');
        if (this.searchText.nativeElement.value.length > 2) {
          /* Replace any whitespaces with '%20' for the query parameter */
          // Perhaps trim the white spaces from the beginning of the search? Perhaps convert double/triple spaces into one?
          let searchText = this.searchText.nativeElement.value.replace(/\s/g, '%20');

          /* Send the search parameters to the katana service to build the correct URI */
            this.katanaService.getCourses({
              account: this.account.nativeElement.value,
              term: this.term.nativeElement.value,
              blueprint: this.blueprint.nativeElement.value,
              searchText: searchText
            })
            .then((courses: Course[]) => {
              console.log(`COURSES`, courses)
              this.courseResults = courses;
            })
            .catch(console.error);

            // this.courseResults.forEach(courseResult => {
            //     this.courseService.courses.forEach(selectedCourse => {
            //         if (courseResult.id === selectedCourse.id) {
            //             console.log(courseResult.id, selectedCourse.id)
            //             if (document.querySelector("tr.table-element-"+courseResult.id+" td>i").innerHTML === "remove_circle") {
            //                 console.log("tr.table-element-"+selectedCourse.id+" td>i", `it's remove circle`);
            //                 document.querySelector("tr.table-element-"+selectedCourse.id+" td>i").innerHTML = "add_circle"
            //             } else {
            //                 console.log("tr.table-element-"+selectedCourse.id+" td>i", `it's add circle`);
            //                 document.querySelector("tr.table-element-"+selectedCourse.id+" td>i").innerHTML = "remove_circle"
            //             }
            //         }
            //     });
                
            // });
        }

    }
}
