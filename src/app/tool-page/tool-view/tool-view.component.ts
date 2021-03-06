import { Component } from '@angular/core';
import { CourseService } from '../../course.service';
import { ToolService } from '../../tool.service';
import { SettingsService } from '../../settings.service';

/**
 * Container for the tool view.
 */
@Component({
    selector: 'app-tool-view',
    templateUrl: './tool-view.component.html',
    styleUrls: ['./tool-view.component.css']
})
export class ToolViewComponent {

    /**
     * Constructor
     * @param courseService Provides information and management for the currently selected courses.
     * @param toolService Provides information and management for available tools.
     * @param settingsService Provides this component with access to user settings.
     */
    constructor(public courseService: CourseService,
        public toolService: ToolService,
        public settingsService: SettingsService) { }

    /**
     * Determines the current total count of issues from all selected courses
     * discovered by the currently selected tool.
     */
    getIssueCount() {
        return this.courseService.courses.reduce((acc, course) => {
            if (!course.itemCards) { return acc; }
            return acc += course.itemCards.reduce((acc2, itemCard) => {
                if (!itemCard.issues) { return acc2; }
                return acc2 += itemCard.issues.length;
            }, 0);
        }, 0);
    }
}
