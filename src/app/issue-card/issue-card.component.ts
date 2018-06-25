import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CourseService, IssueItem } from '../course.service';

@Component({
    selector: 'app-issue-card',
    templateUrl: './issue-card.component.html',
    styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent implements AfterViewInit {
    // Issue Item
    @Input() issueItem: IssueItem;
    // Card Position
    @Input() position: number;
    // Reference to the typeIcon
    @ViewChild('typeIcon') typeIcon: ElementRef;

    constructor(public courseService: CourseService) { }

    /***********************************************************************
     * This class implements AfterViewInit, which runs after the element
     * is rendered completely on the page. This is so we can add the tooltip
     * data correctly.
     **********************************************************************/
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

    /***********************************************************************
     * This is used to determine the icon shown at the top left of a card.
     * It is based on the IssueItem's item_type property, or the type of
     * the item in Canvas. (i.e. Page)
     **********************************************************************/
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
