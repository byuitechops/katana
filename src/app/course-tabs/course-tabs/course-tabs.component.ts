import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CourseService } from '../../course.service';
import { ToolService } from '../../tool.service';

@Component({
    selector: 'app-course-tabs',
    templateUrl: './course-tabs.component.html',
    styleUrls: ['./course-tabs.component.css']
})
export class CourseTabsComponent {

    constructor(private courseService: CourseService, private toolService: ToolService) { }

    courseOverlay() {
        this.courseService.courseSelectionOpen = !this.courseService.courseSelectionOpen;
    }

}
