import { Component, ViewChild, ElementRef } from '@angular/core';
import { CourseService } from '../../course.service';
import { ItemCard } from '../../interfaces';

/**
 * Display for the list of {@link ItemCard}s in the currently selected course.
 */
@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {

    /** Element reference to the issue list. */
    @ViewChild('issueList') issueListEl: ElementRef;

    /** The number of {@link ItemCard}s currently loaded in the list. Used for lazy loading. */
    itemCardCount = 15;

    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     */
    constructor(public courseService: CourseService) {
        this.courseService.courseChange.subscribe(() => {
            this.itemCardCount = 15;
            this.issueListEl.nativeElement.scrollTop = 0;
        });
    }

    /**
     * Runs as the user scrolls down the list. If the user reaches near the bottom of the list, it will
     * load more {@link ItemCard}s into the list. This is, essentially, lazy loading. It helps prevent
     * poor load times with massive amounts of ItemCards, but does cause a little bit of stuttering.
     */
    onScroll() {
        const maxScrollTop = this.issueListEl.nativeElement.scrollHeight - this.issueListEl.nativeElement.clientHeight;
        if (maxScrollTop - this.issueListEl.nativeElement.scrollTop < 500) {
            if (this.courseService.selectedCourse.itemCards.length > this.itemCardCount) {
                this.itemCardCount += 15;
            }
        }
    }

    /**
     * Provides {@link ItemCard}s to load into the list as {@link IssueCard}s, based on the
     * number allowed (itemCardCount).
     */
    getItemCards(): ItemCard[] {
        if (this.courseService.selectedCourse.itemCards.length < this.itemCardCount) {
            return this.courseService.selectedCourse.itemCards;
        } else {
            return this.courseService.selectedCourse.itemCards.slice(0, this.itemCardCount);
        }
    }
}
