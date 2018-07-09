import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Issue, CourseService } from '../course.service';
import { OptionModel } from '../options.service';
import { ToolService } from '../tool.service';

/**
 * Container for the display of a single {@link Issue}.
 */
@Component({
    selector: 'app-issue-container',
    templateUrl: './issue-container.component.html',
    styleUrls: ['./issue-container.component.css']
})
export class IssueContainerComponent implements OnInit {
    /**
     * The issue attached to the display.
     */
    @Input('issue') issue: Issue;

    /**
     * The element containing details about the issue.
     */
    @ViewChild('issueDetails') issueDetails: ElementRef;

    /**
     * Constructor
     * @param toolService Provides information and management for available tools.
     * @param courseService Provides information and management for selected courses.
     */
    constructor(private toolService: ToolService,
        private courseService: CourseService) {
    }

    /**
     * Fired when the component is intialized, this manages the item's display.
     * It inserts the form for the {@link Issue}'s {@link FixOption}s if available.
     */
    ngOnInit() {
        this.issueDetails.nativeElement.innerHTML = this.issue.display;
        this.issue.optionModel = new OptionModel(this.toolService.selectedTool.fixOptions);
        this.issue.formGroup = this.issue.optionModel.toGroup();

        // Update option values if there are values saved for any options
        if (this.issue.tempValues) {
            Object.keys(this.issue.tempValues).forEach(optionKey => {
                let control = this.issue.formGroup.get(optionKey);
                control.setValue(this.issue.tempValues[optionKey], { onlySelf: true });
                control.updateValueAndValidity();
            });
        }
    }

    /**
     * Sets the status of the issue.
     * @param newStatus The new status to set the issue to.
     */
    setIssueStatus(newStatus) {
        if (this.issue.status === 'fixed') {
            return;
        } else if (newStatus === this.issue.status) {
            this.issue.status = 'untouched';
        } else {
            this.issue.status = newStatus;
        }
    }

    /**
     * Determines the classes used to style buttons based on the
     * current status of the issue they belong to.
     * @param {string} desiredStatus What status the issue current is.
     * @param {string} elType Either "button" or "icon".
     * @returns {string} The classes to apply to the element.
     */
    getButtonClasses(desiredStatus: string, elType: string) {
        let classes = '';
        if (elType === 'button') {
            classes += 'waves-effect waves btn white';
        }
        if (this.issue.status !== 'untouched' && this.issue.status !== desiredStatus) {
            classes += ' text-lighten-4';
        } else if (desiredStatus === 'approved') {
            classes += ' text-accent-4';
        } else if (desiredStatus === 'skipped') {
            classes += ' text-darken-2'
        }
        return classes;
    }

    /**
     * Manages the validity of the form on each keystroke.
     * @param optionKey The key of the option this came from.
     */
    onChange(optionKey) {
        if (['untouched', 'fixed', 'failed'].includes(this.issue.status)) {
            this.issue.status = 'untouched';
        }
        if (!this.issue.tempValues) {
            this.issue.tempValues = {};
        }
        this.issue.tempValues[optionKey] = this.issue.formGroup.value[optionKey];
    }

    /**
     * Returns whether or not the item's status is fixed or failed.
     * @returns {boolean} Whether or not this issue's status is fixed or failed.
     */
    isFixed() {
        return this.issue.status === 'fixed' || this.issue.status === 'failed';
    }
}
