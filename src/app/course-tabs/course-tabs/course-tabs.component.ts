import { Component, EventEmitter } from '@angular/core';
import { CourseService } from '../../course.service';
import { ToolService } from '../../tool.service';
import { MaterializeAction } from 'angular2-materialize';
import { SettingsService } from '../../settings.service';

/** The Course Tabs bar, along with the action buttons (settings, feedback, etc.). */
@Component({
    selector: 'app-course-tabs',
    templateUrl: './course-tabs.component.html',
    styleUrls: ['./course-tabs.component.css']
})
export class CourseTabsComponent {

    /**
     * Used to open and close the modal for feedback.
     */
    modalActions = new EventEmitter<string | MaterializeAction>();

    /**
     * Constructor
     * @param courseService Provides information and functionality for courses selected by the user.
     * @param toolService Provides information and functionality for tools available on the server.
     */
    constructor(private courseService: CourseService,
        private toolService: ToolService,
        private settingsService: SettingsService) { }

    /**
     * Toggles the course overlay open and closed.
     */
    courseOverlay() {
        this.courseService.courseSelectionOpen = !this.courseService.courseSelectionOpen;
    }

    /**
     * Opens the feedback modal.
     */
    openModal() {
        this.modalActions.emit({ action: 'modal', params: ['open'] });
    }

    /**
     * Closes the feedback modal.
     */
    closeModal() {
        this.modalActions.emit({ action: 'modal', params: ['close'] });
    }

    /**
     * Opens the course in Canvas in a new tab.
     * @param {number} courseId The Canvas ID of the course
     */
    openCourse(courseId: number): void {
        window.open('https://byui.instructure.com/courses/' + courseId, '_blank');
    }

}
