import { Component, OnInit } from '@angular/core';
import { KatanaService } from '../katana.service';

@Component({
    selector: 'app-course-selection',
    templateUrl: './course-selection.component.html',
    styleUrls: ['./course-selection.component.css']
})
export class CourseSelectionComponent implements OnInit {

    courses = [{
        name: 'Course Support',
        id: 1234,
        code: 'DAA 300',
        instructor: 'Ron Vallejo',
        section: 'Reference',
        account: 'Online',
        term: 'All',
        blueprint: false,
    }, {
        name: 'Technical Operations',
        id: 1347,
        code: 'TECH 100',
        instructor: 'Corey Moore',
        section: 'Reference',
        account: 'Pathway',
        term: 'Fall',
        blueprint: true,
    }, {
        name: 'Visual Media and Design',
        id: 2451,
        code: 'COMM 130',
        instructor: 'Seth Childers',
        section: '3',
        account: 'Campus',
        term: 'Fall',
        blueprint: false,
    }, {
        name: 'Software Engineering I',
        id: 4321,
        code: 'CS 364',
        instructor: 'William Clements',
        section: '1, 4',
        account: 'LDSBC',
        term: 'Spring',
        blueprint: true,
    }];

    constructor(private katanaService: KatanaService) { }

    ngOnInit() {
    }

    getCourses() {
        // CHANGE make this use the course search filters
        this.katanaService.getCourses()
            .then(courses => {
                // Use them to heart's content
            })
            .catch(console.error);
    }

}
