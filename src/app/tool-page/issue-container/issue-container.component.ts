import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CourseService } from '../../course.service'; // Being used in issue-container.component.html (i.e. DO NOT DELETE)
import { ToolService } from '../../tool.service';
import { Issue } from '../../interfaces';
import { OptionModel } from '../../classes';

/**
 * Container for the display of a single {@link Issue}.
 */
@Component({
    selector: 'app-issue-container',
    templateUrl: './issue-container.component.html',
    styleUrls: ['./issue-container.component.css']
})
export class IssueContainerComponent implements OnInit {
    /** The issue attached to the display. */
    @Input('issue') issue: Issue;

    /** The index of the item's issues array the issue is at. */
    @Input('index') index: number;

    /** Element reference to the card containing details about the issue. */
    @ViewChild('issueDetails') issueDetails: ElementRef;

    /** A reference to the code editor element for the respective issue. */
    @ViewChild('codeEditor') codeEditor: ElementRef;

    /**
     * Constructor
     * @param toolService Provides information and management for available tools.
     * @param courseService Provides information and management for selected courses.
     * Being used in issue-container.component.html (i.e. DO NOT DELETE)
     */
    constructor(private toolService: ToolService,
        private courseService: CourseService) { }

    /**
     * Fired when the component is initialized, this manages the item's display.
     * It inserts the form for the {@link Issue}'s {@link FixOption}s if available.
     */
    ngOnInit() {
        this.issueDetails.nativeElement.innerHTML = this.issue.display;
        this.issue.optionModel = new OptionModel(this.toolService.selectedTool.fixOptions);
        this.issue.formGroup = this.issue.optionModel.toGroup();

        // Update option values if there are values saved for any options
        if (this.issue.tempValues) {
            Object.keys(this.issue.tempValues).forEach(optionKey => {
                const control = this.issue.formGroup.get(optionKey);
                control.setValue(this.issue.tempValues[optionKey], { onlySelf: true });
                control.updateValueAndValidity();
            });
        }
    }

    /**
     * Using the {@link Tab}s provided by the Node Tool, builds
     * useable tab objects for each issue.
     * @returns {Object[]} The tabs to use to build the editor instance.
     */
    buildEditorTabs() {
        if (!this.toolService.selectedTool.editorTabs) return;
        return this.toolService.selectedTool.editorTabs.map(editorTab => {
            return {
                title: editorTab.title,
                htmlString: this.issue.html[editorTab.htmlKey],
                readOnly: editorTab.readOnly
            };
        });
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
            classes += ' text-darken-2';
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

    /**
     * Since Object.keys does not work in angular templating, this is
     * a workaround. It checks if the issue has any HTML to display in
     * the editor. Used by the app-code-editor tag to determine if it
     * should display.
     */
    showEditor() {
        return Object.keys(this.issue.html).length > 0;
    }
}
