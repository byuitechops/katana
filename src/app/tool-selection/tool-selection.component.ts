import { Component } from '@angular/core';
import { ToolService } from '../tool.service';
import { CourseService } from '../course.service';

@Component({
    selector: 'app-tool-selection',
    templateUrl: './tool-selection.component.html',
    styleUrls: ['./tool-selection.component.css']
})
export class ToolSelectionComponent {

    constructor(public toolService: ToolService, private courseService: CourseService) { }

}
