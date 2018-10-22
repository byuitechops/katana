import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueCardComponent } from './issue-card/issue-card.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';
import { IssueNavComponent } from './issue-nav/issue-nav.component';
import { IssueContainerComponent } from './issue-container/issue-container.component';
import { ToolViewComponent } from './tool-view/tool-view.component';
import { StatBadgeComponent } from './stat-badge/stat-badge.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { IssueReportPipe } from '../issue-report.pipe';
import { IssueReportComponent } from './issue-report/issue-report.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterializeModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        IssueReportPipe,
        IssueReportComponent,
        IssueListComponent,
        IssueCardComponent,
        IssueDetailsComponent,
        IssueNavComponent,
        IssueContainerComponent,
        ToolViewComponent,
        StatBadgeComponent,
        CodeEditorComponent,
        IssueReportPipe
    ]
})
export class ToolPageModule { }
