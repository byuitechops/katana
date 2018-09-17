import { Component, EventEmitter } from '@angular/core';
import { CourseService } from '../../course.service';
import { ToolService } from '../../tool.service';
import { MaterializeAction } from 'angular2-materialize';
import { SettingsService } from '../../settings.service';
import { ServerService } from '../../server.service';

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
    constructor(public courseService: CourseService,
        public toolService: ToolService,
        public settingsService: SettingsService) { }

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

    /**
     * Opens the course in Canvas in a new tab.
     * @param {Course} course - The course to count issues in
     * @param {string} status - Issue status to match
     * @returns {number} The total number of issues matching the provided status.
     */
    getIssueCount(course, status): number | string {
        if (!course.issueItems) return 0;
        if (course.error) return 'E';
        return course.issueItems.reduce((acc, issueItem) => {
            let issues = issueItem.issues.filter(issue => {
                if (!status) return true;
                return issue.status === status;
            });
            return acc + issues.length;
        }, 0);
    }

}
