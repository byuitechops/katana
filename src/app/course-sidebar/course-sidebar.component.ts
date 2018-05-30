import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';
import { CoursesService } from '../courses.service';

@Component({
    selector: 'app-course-sidebar',
    templateUrl: './course-sidebar.component.html',
    styleUrls: ['./course-sidebar.component.css']
})
export class CourseSidebarComponent implements OnInit {

    selectedCourse: Element;
    courseSelectionOpen: boolean = false;

    constructor(private issuesService: IssuesService, private coursesService: CoursesService) { }

    courseOverlay() {
        document.querySelector('app-course-selection').style.display = this.courseSelectionOpen ? 'none' : 'block';
        this.courseSelectionOpen = !this.courseSelectionOpen;
    }

    ngOnInit() {

    }

}