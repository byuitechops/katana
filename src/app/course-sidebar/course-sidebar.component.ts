import { Component, AfterViewInit } from '@angular/core';
import { CourseService, Course } from '../course.service';
import { ToolService } from '../tool.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-course-sidebar',
    templateUrl: './course-sidebar.component.html',
    styleUrls: ['./course-sidebar.component.css']
})
export class CourseSidebarComponent implements AfterViewInit {

    constructor(public courseService: CourseService,
        private toolService: ToolService) { }

    courseOverlay() {
        // if the tool is running, don't do anything
        if (this.toolService.processing) {
            return;
        }

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

        if (this.courseService.courseEditOpen) {
            this.toggleEditWindow();
        }
        this.courseService.courseSelectionOpen = !this.courseService.courseSelectionOpen;
    }

    setSelectedCourse(course: Course) {
        if (window.location.href.includes('tool-view')) {
            this.courseService.selectedCourse = course;
        }
    }

    removeAll() {
        this.courseService.courses.forEach(c => this.courseService.removeCourse(c));
    }

    toggleEditWindow() {
        if (this.courseService.courseSelectionOpen) {
            this.courseOverlay();
        }
        this.courseService.courseEditOpen = !this.courseService.courseEditOpen;
        let newWidth = this.courseService.courseEditOpen ? '207px' : '112px';
        document.documentElement.style.setProperty(`--course-sidebar-width`, newWidth);
    }

    ngAfterViewInit() {

    }
}