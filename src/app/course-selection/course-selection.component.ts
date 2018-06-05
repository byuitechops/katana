import { Component, OnInit } from '@angular/core';
import { KatanaService } from '../katana.service';

@Component({
    selector: 'app-course-selection',
    templateUrl: './course-selection.component.html',
    styleUrls: ['./course-selection.component.css']
})
export class CourseSelectionComponent implements OnInit {

    courses = [{
        name: 'Katana 101',
        id: 13028,
        code: 'K 101',
        instructor: 'Zach Williams',
        section: 'Reference',
        account: 'Online',
        term: 'All',
        blueprint: false,
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
