import { Component } from '@angular/core';
import { CourseService } from '../course.service';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-tool-view',
    templateUrl: './tool-view.component.html',
    styleUrls: ['./tool-view.component.css']
})
export class ToolViewComponent {

    constructor(public courseService: CourseService,
        public toolService: ToolService) { }

    getIssueItemCount() {
        return this.courseService.courses.reduce((acc, course) => {
            if (!course.issueItems) return acc;
            return acc += course.issueItems.length;
        }, 0);
    }

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
