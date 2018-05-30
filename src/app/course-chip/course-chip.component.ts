import { Component, OnInit, Input } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
    selector: 'app-course-chip',
    templateUrl: './course-chip.component.html',
    styleUrls: ['./course-chip.component.css']
})
export class CourseChipComponent implements OnInit {
    @Input() // Course Code
    course: object;

    constructor(private issuesService: IssuesService) { }

    ngOnInit() { }
}
