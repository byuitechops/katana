import { Component } from '@angular/core';
import { CourseService, Course } from '../course.service';
import { ToolService } from '../tool.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-course-sidebar',
    templateUrl: './course-sidebar.component.html',
    styleUrls: ['./course-sidebar.component.css']
})
export class CourseSidebarComponent {

    constructor(public courseService: CourseService,
        private toolService: ToolService,
        private _location: Location,
        private router: Router) { }

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
            overlay.className = 'open';
        }

        this.courseService.courseSelectionOpen = !this.courseService.courseSelectionOpen;
        let newWidth = this.courseService.courseSelectionOpen ? '207px' : '112px';
        document.documentElement.style.setProperty(`--course-sidebar-width`, newWidth);
    }

    setSelectedCourse(course: Course) {
        if (window.location.href.includes('tool-view')) {
            this.courseService.selectedCourse = course;
        }
    }

    removeAll() {
        this.courseService.courses.forEach(c => this.courseService.removeCourse(c));
    }
}