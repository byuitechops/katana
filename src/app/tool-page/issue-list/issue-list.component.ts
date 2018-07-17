import { Component } from '@angular/core';
import { CourseService } from '../../course.service';

/**
 * Display for the list of {@link IssueItem}s in the currently selected course.
 */
@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent {
    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     */
    constructor(public courseService: CourseService) { }
}
