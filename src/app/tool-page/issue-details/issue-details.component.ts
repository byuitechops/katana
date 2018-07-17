import { Component } from '@angular/core';
import { CourseService } from '../../course.service';

/**
 * Container for all {@link IssueContainerComponent}s used to display
 * issues within the currently selected {@link IssueItem}.
 */
@Component({
    selector: 'app-issue-details',
    templateUrl: './issue-details.component.html',
    styleUrls: ['./issue-details.component.css']
})
export class IssueDetailsComponent {
    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     */
    constructor(public courseService: CourseService) { }
}
