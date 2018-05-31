import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IssuesService, IssueItem } from '../issues.service';

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

    constructor(private issuesService: IssuesService) { }

    /***********************************************************************
     * This class implements AfterViewInit, which runs after the element
     * is rendered completely on the page. This is so we can add the tooltip
     * data correctly.
     **********************************************************************/
    ngAfterViewInit() {
        if (!this.typeIcon) return;
        this.typeIcon.nativeElement.setAttribute('data-tooltip', this.issueItem.item_type);
    }

    /***********************************************************************
     * This is used to determine the icon shown at the top left of a card.
     * It is based on the IssueItem's item_type property, or the type of
     * the item in Canvas. (i.e. Page)
     **********************************************************************/
    getTypeIcon() {
        let typeIcons = {
            'Page': 'insert_drive_file',
            'Assignment': 'assignment',
            'Discussion': 'question_answer',
            'File': 'attach_file',
            'Folder': 'folder',
            'Quiz': 'gavel',
            'QuizQuestion': 'help_outline',
            'Module': 'view_agenda',
            'ModuleItem': 'view_list',
            'Universal': '',
            'Syllabus': 'language',
            'CourseSetting': 'settings',
        }
        return typeIcons[this.issueItem.item_type];
    }

    /***********************************************************************
     * This is used to determine the icon shown at the left of an issue on
     * a card. It is determined by the status of the icon. (i.e. "fixed")
     **********************************************************************/
    getStatusIcon(status) {
        let statusIcons = {
            'fixed': 'check_circle',
            'approved': 'check_circle_outline',
            'skipped': 'call_missed_outgoing',
            'untouched': 'panorama_fish_eye'
        }
        return statusIcons[status];
    }

    /***********************************************************************
     * This is used to determine the icon color for the status icon of an
     * individual issue, as shown on an IssueItem card.
     **********************************************************************/
    getIconColor(status) {
        let doc = getComputedStyle(document.body);
        let statusColors = {
            'fixed': doc.getPropertyValue('--accent-1'),
            'approved': '#00c853',
            'skipped': '#e53935',
            'untouched': doc.getPropertyValue('--primary-6')
        }
        return statusColors[status];
    }

}
