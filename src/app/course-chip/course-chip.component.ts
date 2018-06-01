import { Component, OnInit, Input } from '@angular/core';
import { CourseService, Course } from '../course.service';

@Component({
    selector: 'app-course-chip',
    templateUrl: './course-chip.component.html',
    styleUrls: ['./course-chip.component.css']
})
export class CourseChipComponent implements OnInit {
    @Input() // Course Code
    course: Course;

    constructor(public courseService: CourseService) { }

    ngOnInit() { }
}
