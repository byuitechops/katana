import { Component } from '@angular/core';
import { CourseService } from '../../course.service';
import { ServerService } from '../../server.service';
import { MaterializeAction } from 'angular2-materialize';
import { EventEmitter } from '@angular/core';
import { ToolService } from '../../tool.service';
import { csvFormatRows } from 'd3-dsv';

/**
 * Container for managing various actions on the tool view page,
 * such as the "Fix All Approved" button.
 */
@Component({
    selector: 'app-issue-nav',
    templateUrl: './issue-nav.component.html',
    styleUrls: ['./issue-nav.component.css']
})
export class IssueNavComponent {

    /**
     * From [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize},
     * which allows the modal to open and close.
     */
    modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();

    /**
     * Constructor
     * @param courseService Provides information and management for selected courses.
     * @param toolService Provides information and management for available tools.
     * @param serverService Provides functionality to make API calls to the Katana server.
     */
    constructor(public courseService: CourseService,
        public toolService: ToolService,
        public serverService: ServerService) { }

    /**
     * Opens the modal using [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize}.
     */
    openModal() {
        this.modalActions.emit({ action: 'modal', params: ['open'] });
    }

    /**
     * Closes the modal using [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize}.
     */
    closeModal() {
        this.modalActions.emit({ action: 'modal', params: ['close'] });
    }

    /**
     * Returns the user the {@link ItemCard}s belonging to the provided course.
     * @param course The course to retrieve the ItemCards from.
     * @returns {ItemCard[]} The ItemCards belonging to the provided course.
     */
    getItemCards(course) {
        if (!course.itemCards) { return []; }
        return course.itemCards.reduce((acc, itemCard) => {
            if (!itemCard.issues) { return acc; }
            return [...acc, ...itemCard.issues];
        }, []);
    }

    /**
     * Sets the currently selected course and currently selected {@link ItemCard}.
     * @param course The course to set as the currently selected course.
     * @param issue The issue to use to set the currently selected ItemCard.
     */
    selectItemCard(course, issue) {
        this.courseService.selectedCourse = course;
        this.courseService.selectedItemCard = course.itemCards.find(itemCard => itemCard.issues.includes(issue));
        this.closeModal();
    }

    /**
     * A method to set the status of each issue in the selected course to 'approved'
     */
    approveAll() {
        // only approve the issues if the tool's 'enableApproveAll' attribute is set to true
        if (this.toolService.selectedTool.enableApproveAll === true) {
            this.courseService.selectedCourse.itemCards.forEach(itemCard => {
                itemCard.issues.forEach(issue => {
                    issue.status = 'approved';
                });
            });
        }
    }

    /**
     * Downloads a CSV to the user's computer containing all of the
     * currently displayed issues.
     */
    downloadIssues() {
        let csvReport = '';
        this.courseService.courses.forEach((course, i) => {
            course.itemCards.forEach((itemCard, j) => {
                if (i < 1 && j < 1) {
                    csvReport = csvFormatRows([[
                        'Issue Title',
                        'Status',
                        'Option Values',
                        'Item Title',
                        'Item ID',
                        'Course ID',
                        'Category',
                        'Link',
                        'Details',
                    ]].concat(itemCard.issues.map(issue => {
                        const flatIssueDetails = Object.entries(issue.details).reduce((acc, pair) => {
                            const detail = `${pair[0]}: ${pair[1]}`;
                            return acc.concat(detail);
                        }, []);

                        return [
                            issue.title,
                            issue.status,
                            issue.optionValues ? issue.optionValues : '',
                            itemCard.title,
                            itemCard.item_id,
                            itemCard.course_id,
                            itemCard.category,
                            itemCard.link,
                            ...flatIssueDetails
                        ];
                    }))) + '\n';
                } else {
                    // Make the log without the header
                    csvReport += csvFormatRows(itemCard.issues.map(issue => {
                        const flatIssueDetails = Object.entries(issue.details).reduce((acc, pair) => {
                            const detail = `${pair[0]}: ${pair[1]}`;
                            return acc.concat(detail);
                        }, []);
                        return [
                            issue.title,
                            issue.status,
                            issue.optionValues ? issue.optionValues : '',
                            itemCard.title,
                            itemCard.item_id,
                            itemCard.course_id,
                            itemCard.category,
                            itemCard.link,
                            ...flatIssueDetails
                        ];
                    })) + '\n';
                }
            });
        });

        // Setup the link to download the csv report
        const fileName = 'csvReport.csv';
        const a = <HTMLAnchorElement>document.getElementById('download');
        const blob = new Blob([csvReport], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = fileName;
    }
}
