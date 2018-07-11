import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CourseService, IssueItem } from '../course.service';

/**
 * Manages the display for a single {@link IssueItem}.
 */
@Component({
    selector: 'app-issue-card',
    templateUrl: './issue-card.component.html',
    styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent implements AfterViewInit {
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
        if (!this.typeIcon) return;
        let types = {
            'pages': 'Page',
            'assignments': 'Assignment',
            'discussions': 'Discussion',
            'files': 'File',
            'folders': 'Folder',
            'quizzes': 'Quiz',
            'quizQuestions': 'Quiz Question',
            'modules': 'Module',
            'moduleItems': 'Module Item',
        }
        this.typeIcon.nativeElement.setAttribute('data-tooltip', types[this.issueItem.category]);
    }

    /**
     * This is used to determine the icon shown at the top left of a card.
     * It is based on the IssueItem's item_type property, or the type of
     * the item in Canvas. (i.e. Page)
     * @returns {string} The icon title to use to display the icon.
     */
    getTypeIcon() {
        let typeIcons = {
            'pages': 'insert_drive_file',
            'assignments': 'assignment',
            'discussions': 'question_answer',
            'files': 'attach_file',
            'folders': 'folder',
            'quizzes': 'gavel',
            'quizQuestions': 'help_outline',
            'modules': 'view_agenda',
            'moduleItems': 'view_list',
        }
        return typeIcons[this.issueItem.category];
    }
}
