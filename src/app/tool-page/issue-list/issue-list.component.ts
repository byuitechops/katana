import { Component, ViewChild, ElementRef } from '@angular/core';
import { CourseService } from '../../course.service';
import { IssueItem } from '../../interfaces';

/**
 * Display for the list of {@link IssueItem}s in the currently selected course.
 */
@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',
    styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent {

    @ViewChild('issueList') issueListEl: ElementRef;

    issueItemCount: number = 15;

    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     */
    constructor(public courseService: CourseService) {
        this.courseService.courseChange.subscribe(() => {
            this.issueItemCount = 15;
            this.issueListEl.nativeElement.scrollTop = 0;
        });
    }

    onScroll() {
        let maxScrollTop = this.issueListEl.nativeElement.scrollHeight - this.issueListEl.nativeElement.clientHeight;
        if (maxScrollTop - this.issueListEl.nativeElement.scrollTop < 500) {
            if (this.courseService.selectedCourse.issueItems.length > this.issueItemCount) {
                this.issueItemCount += 15;
            }
        }
    }

    getIssueItems(): IssueItem[] {
        if (this.courseService.selectedCourse.issueItems.length < this.issueItemCount) {
            return this.courseService.selectedCourse.issueItems;
        } else {
            return this.courseService.selectedCourse.issueItems.slice(0, this.issueItemCount);
        }
    }
}