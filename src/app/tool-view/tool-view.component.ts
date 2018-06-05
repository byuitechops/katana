import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-tool-view',
    templateUrl: './tool-view.component.html',
    styleUrls: ['./tool-view.component.css']
})
export class ToolViewComponent implements OnInit {

    constructor(public courseService: CourseService,
        public toolService: ToolService) { }

    ngOnInit() {
    }

}
