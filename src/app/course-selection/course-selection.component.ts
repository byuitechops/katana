import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { KatanaService } from '../katana.service';
import { Course } from '../course.service';

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

    courseResults: Course[] = [{
        course_name: 'Katana 101',
        id: 13028,
        course_code: 'K 101',
        instructor: 'Zach Williams',
        account: 'Online',
        term: 'All',
        blueprint: false,
        url: 'www.google.com'
    }
];
    
    constructor(private katanaService: KatanaService) { }

    getCourses() {
        let textInput = this.searchText.nativeElement.value.replace(/\s/g, '');

        if (textInput.length > 2) {
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
        }   
    }
}
