import { Component } from '@angular/core';
import { CourseService } from '../../course.service';
import { ToolService } from '../../tool.service';

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
     */
    constructor(public courseService: CourseService,
        public toolService: ToolService) { }

    /**
     * Determines the current total count of issues from all selected courses
     * discovered by the currently selected tool.
     */
    getIssueCount() {
        return this.courseService.courses.reduce((acc, course) => {
            if (!course.issueItems) return acc;
            return acc += course.issueItems.reduce((acc2, issueItem) => {
                if (!issueItem.issues) return acc2;
                return acc2 += issueItem.issues.length;
            }, 0)
        }, 0);
    }


}
