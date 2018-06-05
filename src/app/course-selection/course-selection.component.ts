import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { KatanaService } from '../katana.service';

@Component({
    selector: 'app-course-selection',
    templateUrl: './course-selection.component.html',
    styleUrls: ['./course-selection.component.css']
})
export class CourseSelectionComponent implements OnInit{
    @ViewChild('account') private account: ElementRef;
    @ViewChild('term') private term: ElementRef;
    @ViewChild('blueprint') private blueprint: ElementRef;
    @ViewChild('searchText') private searchText: ElementRef;

    courses = [{
        name: 'Katana 101',
        id: 13028,
        code: 'K 101',
        instructor: 'Zach Williams',
        section: 'Reference',
        account: 'Online',
        term: 'All',
        blueprint: false,
    }
    //     {
    //     name: 'Course Support',
    //     id: 1234,
    //     code: 'DAA 300',
    //     instructor: 'Ron Vallejo',
    //     section: 'Reference',
    //     account: 'Online',
    //     term: 'All',
    //     blueprint: false,
    // }, {
    //     name: 'Technical Operations',
    //     id: 1347,
    //     code: 'TECH 100',
    //     instructor: 'Corey Moore',
    //     section: 'Reference',
    //     account: 'Pathway',
    //     term: 'Fall',
    //     blueprint: true,
    // }, {
    //     name: 'Visual Media and Design',
    //     id: 2451,
    //     code: 'COMM 130',
    //     instructor: 'Seth Childers',
    //     section: '3',
    //     account: 'Campus',
    //     term: 'Fall',
    //     blueprint: false,
    // }, {
    //     name: 'Software Engineering I',
    //     id: 4321,
    //     code: 'CS 364',
    //     instructor: 'William Clements',
    //     section: '1, 4',
    //     account: 'LDSBC',
    //     term: 'Spring',
    //     blueprint: true,
    // }
];
    
    constructor(private katanaService: KatanaService) { }

    getCourses() {
        let textInput = this.searchText.nativeElement.value.replace(/\s/g, '');

        if (textInput.length > 2) {
            /* Replace any whitespaces with '%20' for the query parameter */
            let searchText = this.searchText.nativeElement.value.replace(/\s/g, '%20');

            // CHANGE make this use the course search filters
            this.katanaService.getCourses({
                account: this.account.nativeElement.value, 
                term: this.term.nativeElement.value, 
                blueprint: this.blueprint.nativeElement.value, 
                searchText: searchText
            })
            .then(courses => {
                console.log(typeof courses, courses)
                // Use them to heart's content
                // courses.forEach(course => {
                    this.courses.push(courses);
                    console.log(this.courses);
                // });
            })
            .catch(console.error);
        }   
    }
}
