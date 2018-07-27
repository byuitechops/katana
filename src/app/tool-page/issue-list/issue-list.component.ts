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

    /** Element reference to the issue list. */
    @ViewChild('issueList') issueListEl: ElementRef;

    /** The number of {@link IssueItem}s currently loaded in the list. Used for lazy loading. */
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

    /** 
     * Runs as the user scrolls down the list. If the user reaches near the bottom of the list, it will
     * load more {@link IssueItem}s into the list. This is, essentially, lazy loading. It helps prevent
     * poor load times with massive amounts of IssueItems, but does cause a little bit of stuttering.
     */
    onScroll() {
        let maxScrollTop = this.issueListEl.nativeElement.scrollHeight - this.issueListEl.nativeElement.clientHeight;
        if (maxScrollTop - this.issueListEl.nativeElement.scrollTop < 500) {
            if (this.courseService.selectedCourse.issueItems.length > this.issueItemCount) {
                this.issueItemCount += 15;
            }
        }
    }

    /** 
     * Provides {@link IssueItem}s to load into the list as {@link IssueCard}s, based on the
     * number allowed (issueItemCount).
     */
    getIssueItems(): IssueItem[] {
        if (this.courseService.selectedCourse.issueItems.length < this.issueItemCount) {
            return this.courseService.selectedCourse.issueItems;
        } else {
            return this.courseService.selectedCourse.issueItems.slice(0, this.issueItemCount);
        }
    }
}