import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
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

    searching: boolean = false;

    courseResults: Course[] = [{
        id: 1318,
        course_name: 'Katana 10',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],

        url: 'www.google.com',
        blueprint: false
    }, {
        id: 1301,
        course_name: 'Katana 11',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: true
    }, {
        id: 3018,
        course_name: 'Katana 01',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 1318,
        course_name: 'Katana 10',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 1301,
        course_name: 'Katana 11',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: true
    }, {
        id: 3018,
        course_name: 'Katana 01',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 1318,
        course_name: 'Katana 10',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 1301,
        course_name: 'Katana 11',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: true
    }, {
        id: 3018,
        course_name: 'Katana 01',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 1318,
        course_name: 'Katana 10',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 1301,
        course_name: 'Katana 11',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: true
    }, {
        id: 3018,
        course_name: 'Katana 01',
        course_code: 'K 101',
        instructor: 'Seth Childers',
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 12853,
        course_name: "Conversion Gauntlet 5/24 9:58 - Seth Childers",
        course_code: "CG 5/24 9:58",
        instructor: "none",
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 12856,
        course_name: "Conversion Gauntlet 5/24 10:10 - Seth Childers",
        course_code: "CG 5/24 10:10",
        instructor: "none",
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 12890,
        course_name: "Conversion Gauntlet 5/25 10:05 - Seth Childers",
        course_code: "CG 5/25 10:5",
        instructor: "none",
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }, {
        id: 12891,
        course_name: "Conversion Gauntlet 5/25 10:12 - Seth Childers",
        course_code: "CG 5/25 10:12",
        instructor: "none",
        issueItems: [],
        url: 'www.google.com',
        blueprint: false
    }];

    constructor(private katanaService: KatanaService,
        public courseService: CourseService) { }

    async getCourses() {

        if (this.searchText.nativeElement.value.length > 2) {

            /* Replace any whitespaces with '%20' for the query parameter */
            // Perhaps trim the white spaces from the beginning of the search? Perhaps convert double/triple spaces into one?
            var searchText = this.searchText.nativeElement.value.replace(/\s/g, '%20');

            this.searching = true;

            /* Send the search parameters to the katana service to build the correct URI */
            this.katanaService.getCourses({
                subAccount: this.subAccount.nativeElement.value,
                term: this.term.nativeElement.value,
                blueprint: this.blueprint.nativeElement.value,
                searchText: searchText
            })
                .then((courses: Course[]) => {
                    if (searchText === this.searchText.nativeElement.value.replace(/\s/g, '%20')) {
                        this.searching = false;
                        this.courseResults = courses;
                    }
                })
                .then(this.toggleSelected)
                .catch(console.error);
        }
    }

    toggleSelected() {
        // if (this.courseResults) {
        //     this.courseResults.forEach(courseResult => {
        //         this.courseService.courses.forEach(selectedCourse => {
        //             console.log(courseResult.id, selectedCourse.id)
        //             if (courseResult.id === selectedCourse.id) {
        //                 if (document.querySelector("tr.table-element-"+courseResult.id+" td>i").innerHTML === "remove_circle") {
        //                     console.log("tr.table-element-"+selectedCourse.id+" td>i", `it's remove circle`);
        //                     document.querySelector("tr.table-element-"+selectedCourse.id+" td>i").innerHTML = "add_circle"
        //                 } else {
        //                     console.log("tr.table-element-"+selectedCourse.id+" td>i", `it's add circle`);
        //                     document.querySelector("tr.table-element-"+selectedCourse.id+" td>i").innerHTML = "remove_circle"
        //                 }
        //             }
        //         });

        //     });
        // }
    }

    isAdded(course) {
        return this.courseService.courses.find(c => c.id === course.id) !== undefined;
    }

    ngAfterViewInit() { }
}
