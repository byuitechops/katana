import { Component } from '@angular/core';
import { CourseService } from '../../course.service'; // Being used in issue-details.component.html (i.e. DO NOT DELETE)

/**
 * Container for all {@link IssueContainerComponent}s used to display
 * issues within the currently selected {@link ItemCard}.
 */
@Component({
    selector: 'app-result-list',
    templateUrl: './result-list.component.html',
    styleUrls: ['./result-list.component.css']
})
export class ResultListComponent {
    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     * Being used in issue-details.component.html (i.e. DO NOT DELETE)
     */
    constructor(public courseService: CourseService) { }
}
