import { Component } from '@angular/core';
import { ToolService } from '../../tool.service';
import { CourseService } from '../../course.service'; // Used in tool-selection.component.html (i.e. DO NOT DELETE)

/**
 * Handles the view for selecting tools.
 */
@Component({
    selector: 'app-tool-selection',
    templateUrl: './tool-selection.component.html',
    styleUrls: ['./tool-selection.component.css']
})
export class ToolSelectionComponent {

    /**
     * Constructor
     * @param toolService Provides information and management for available tools.
     * @param courseService Provides information and management for selected courses.
     * Used in tool-selection.component.html (i.e. DO NOT DELETE).
     */
    constructor(public toolService: ToolService, public courseService: CourseService) { }
}
