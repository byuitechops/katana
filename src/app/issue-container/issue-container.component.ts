import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Issue, CourseService } from '../course.service';
import { OptionModel } from '../options.service';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-issue-container',
    templateUrl: './issue-container.component.html',
    styleUrls: ['./issue-container.component.css']
})
export class IssueContainerComponent implements OnInit {
    @Input() // Issue
    issue: Issue;
    @ViewChild('issueDetails') issueDetails: ElementRef;

    constructor(private toolService: ToolService,
        private courseService: CourseService) {
    }

    ngOnInit() {
        this.issueDetails.nativeElement.innerHTML = this.issue.display;
        this.issue.optionModel = new OptionModel(this.toolService.selectedTool.fixOptions);
        this.issue.formGroup = this.issue.optionModel.toGroup();
        console.log(this.issue);
    }

    setIssueStatus(newStatus) {
        if (this.issue.status === 'fixed') {
            return;
        } else if (newStatus === this.issue.status) {
            this.issue.status = 'untouched';
        } else {
            this.issue.status = newStatus;
        }
    }

    // TODO Switch this to use the methods from course service 
    getButtonClasses(desiredStatus: string, elType: string) {
        let classes = '';
        if (elType === 'button') {
            classes += 'waves-effect waves btn-flat';
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

    setStatusUntouched() {
        if (this.issue.status !== 'untouched') {
            this.issue.status = 'untouched';
        }
    }
}
