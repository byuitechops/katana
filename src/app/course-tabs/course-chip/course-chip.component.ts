import { Component, Input } from '@angular/core';
import { CourseService } from '../../course.service';
import { ToolService } from '../../tool.service'; // Being used in course-chip.component.html (i.e. DO NOT DELETE)
import { Course } from '../../interfaces';

/**
 * Represents a {@link Course} to be acted on. Generated based on the list of 
 * {@link Course}s stored in {@link CourseService}.
 */
@Component({
    selector: 'app-course-chip',
    templateUrl: './course-chip.component.html',
    styleUrls: ['./course-chip.component.css']
})
export class CourseChipComponent {

    /**
     * The {@link Course} this chip represents
     */
    @Input() course: Course;

    /**
     * Constructor
     * @param courseService Allows this component to identify the currently selected course
     * @param toolService Allows this component to identify if the tool view is open.
     * Being used in course-chip.component.html (i.e. DO NOT DELETE)
     */
    constructor(public courseService: CourseService,
        private toolService: ToolService) { }

    /**
     * Opens the course in Canvas in a new tab.
     */
    openCourse(): void {
        window.open('https://byui.instructure.com/courses/' + this.course.id, '_blank');
    }

    /**
     * Formats the instructor's name to fit on the chip appropriately.
     * @returns {string} The formatted instructor name
     */
    buildInstructorName(): string {
        const names = this.course.instructor.replace(/,/, '').split(' ');
        let instructorName = this.course.instructor === 'none' ? 'No Instructor' : this.course.instructor;
        if (names.length > 1 && this.course.instructor.includes(',')) {
            instructorName = `${names[1][0]}. ${names[0]}`;
        } else if (names.length > 1) {
            instructorName = `${names[0][0]}. ${names[1]}`;
        }
        return instructorName;
    }

    /**
     * Opens the course in Canvas in a new tab.
     * @param {string} status - Issue status to match
     * @returns {number} The total number of issues matching the provided status.
     */
    getIssueCount(status): number | string {
        if (!this.course.issueItems) return 0;
        if (this.course.error) return 'E';
        return this.course.issueItems.reduce((acc, issueItem) => {
            let issues = issueItem.issues.filter(issue => {
                if (!status) return true;
                return issue.status === status;
            });
            return acc + issues.length;
        }, 0);
    }
}
