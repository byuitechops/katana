import { Component } from '@angular/core';
import { CourseService } from '../../course.service';
import { ToolService } from '../../tool.service'; // Being used in course-sidebar.component.html (i.e. DO NOT DELETE)
import { Course } from '../../interfaces';

/**
 * The sidebar containing selected course management and the
 * {@link CourseSelectionComponent}.
 */
@Component({
    selector: 'app-course-sidebar',
    templateUrl: './course-sidebar.component.html',
    styleUrls: ['./course-sidebar.component.css']
})
export class CourseSidebarComponent {

    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     * @param toolService Provides information and management for available tools.
     * Being used in course-sidebar.component.html (i.e. DO NOT DELETE)
     */
    constructor(public courseService: CourseService,
        private toolService: ToolService) { }

    /**
     * Toggles the {@link CourseSelectionComponent} overlay open and closed.
     */
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
        // let newWidth = this.courseService.courseSelectionOpen ? '207px' : '112px';
        // document.documentElement.style.setProperty(`--course-sidebar-width`, newWidth);
    }

    /**
     * Sets the currently selected course to the one provided.
     * @param {Course} course The course to set as the currently selected course.
     */
    setSelectedCourse(course: Course) {
        if (window.location.href.includes('tool-view')) {
            this.courseService.selectedCourse = course;
        }
    }

    /** Removes all courses from the sidebar. */
    removeAll() {
        this.courseService.courses.forEach(c => this.courseService.removeCourse(c));
    }
}