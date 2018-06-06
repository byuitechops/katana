import { Component, OnInit } from '@angular/core';
import { CourseService, Course } from '../course.service';
import { ToolService } from '../tool.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-course-sidebar',
    templateUrl: './course-sidebar.component.html',
    styleUrls: ['./course-sidebar.component.css']
})
export class CourseSidebarComponent implements OnInit {

    courseSelectionOpen: boolean = false;

    constructor(public courseService: CourseService,
        private toolService: ToolService,
        private activatedRoute: ActivatedRoute) { }

    courseOverlay() {
        // cast the returned Element object to an HTMLElement object
        let overlay: HTMLElement = document.querySelector('app-course-selection');

        // toggle add the 'open' class to the app-course-selection component
        if (overlay.className === 'open') {
            overlay.className = 'close';
        } else if (overlay.className === 'close') {
            overlay.className = 'open';
        } else {
            overlay.style.display = 'block';
            overlay.className = 'open'
        }

        // change the -> arrow to <- after opening the course selection overlay
        document.querySelector('app-course-sidebar .courseSidebar__expandSidebar i').innerHTML = this.courseSelectionOpen ? 'arrow_forward' : 'arrow_back';
        this.courseSelectionOpen = !this.courseSelectionOpen;
    }

    setSelectedCourse(course: Course) {
        if (window.location.href.includes('tool-view')) {
            this.courseService.selectedCourse = course;
        }
    }

    ngOnInit() {

    }

}