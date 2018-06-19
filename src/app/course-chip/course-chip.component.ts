import { Component, Input } from '@angular/core';
import { CourseService, Course } from '../course.service';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-course-chip',
    templateUrl: './course-chip.component.html',
    styleUrls: ['./course-chip.component.css']
})
export class CourseChipComponent {
    @Input() course: Course;

    constructor(public courseService: CourseService,
        private toolService: ToolService,
        private router: Router) { }

    openCourse() {
        window.open('https://byui.instructure.com/courses/' + this.course.id, '_blank');
    }

    buildInstructorName() {
        let names = this.course.instructor.replace(/,/, '').split(' ');
        var instructorName = this.course.instructor === 'none' ? 'No Instructor' : this.course.instructor;
        if (names.length > 1 && this.course.instructor.includes(',')) {
            instructorName = `${names[1][0]}. ${names[0]}`;
        } else if (names.length > 1) {
            instructorName = `${names[0][0]}. ${names[1]}`;
        }

        return instructorName;
    }

    getIssueCount(status) {
        if (!this.course.issueItems) return '';
        return this.course.issueItems.reduce((acc, issueItem) => {
            let issues = issueItem.issues.filter(issue => {
                return issue.status === status;
            });
            return acc + issues.length;
        }, 0) || '';
    }
}
