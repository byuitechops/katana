import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CourseService } from '../../course.service';
import { IssueItem } from '../../interfaces';

/**
 * Manages the display for a single {@link IssueItem}.
 */
@Component({
    selector: 'app-item-card',
    templateUrl: './item-card.component.html',
    styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements AfterViewInit {
    /**
     * The {@link IssueItem} used by this component.
     */
    @Input('issueItem') issueItem: IssueItem;
    /**
     * The position of the component in the {@link IssueListComponent}.
     */
    @Input('position') position: number;
    /**
     * Reference to the element in the view for this component that
     * contains it's item type icon (ex. Page, Discussion, Quiz).
     */
    @ViewChild('typeIcon') typeIcon: ElementRef;

    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     */
    constructor(public courseService: CourseService) { }

    /**
     * This class implements AfterViewInit, which runs after the element
     * is rendered completely on the page. This is so we can add the tooltip
     * data correctly to the type icon.
     */
    ngAfterViewInit() {
        if (!this.typeIcon) { return; }
        const types = {
            'pages': 'Page',
            'assignments': 'Assignment',
            'discussions': 'Discussion',
            'files': 'File',
            'folders': 'Folder',
            'quizzes': 'Quiz',
            'quizQuestions': 'Quiz Question',
            'modules': 'Module',
            'moduleItems': 'Module Item',
        };
        this.typeIcon.nativeElement.setAttribute('data-tooltip', types[this.issueItem.category]);
    }

    /**
     * This is used to determine the icon shown at the top left of a card.
     * It is based on the IssueItem's item_type property, or the type of
     * the item in Canvas. (i.e. Page)
     * @returns {string} The icon title to use to display the icon.
     */
    getTypeIcon() {
        const typeIcons = {
            'pages': 'insert_drive_file',
            'assignments': 'assignment',
            'discussions': 'question_answer',
            'files': 'attach_file',
            'folders': 'folder',
            'quizzes': 'gavel',
            'quizQuestions': 'help_outline',
            'modules': 'view_agenda',
            'moduleItems': 'view_list',
        };
        return typeIcons[this.issueItem.category];
    }

    /**
     * This is used in place of typical anchors. It will look scroll to the issue card selected from the issueItem card
     * @param issueItemId Provides the issueItem's id that helps form the issue card's id for the anchor tag to work
     * @param i Provides the index of the issue in IssueItem.issues[] to help form the unique id for the issue card
     */
    viewIssueCard(issueItemId, i) {
        const el = document.getElementById(`${issueItemId}-${i}`);
        el.scrollIntoView();
    }
}
