import { Component, OnInit, Input } from '@angular/core';
import { CourseService, Course } from '../course.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-course-chip',
    templateUrl: './course-chip.component.html',
    styleUrls: ['./course-chip.component.css']
})
export class CourseChipComponent implements OnInit {
    @Input() // Course Code
    course: Course;

    constructor(public courseService: CourseService,
        private router: Router) { }

    ngOnInit() { }

    isSelected() {
        let loc = window.location.href;
        // if the current page is not the tool page, don't let the chips be selected
        if (!loc.includes('issues')) {
            return false;
        }
        if (this.courseService.selectedCourse) {
                return this.courseService.selectedCourse !== null && this.courseService.selectedCourse.id === this.course.id;
            } else {
                return false;
            }
    }
}
