import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemListComponent } from './item-list/item-list.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueNavComponent } from './issue-nav/issue-nav.component';
import { IssueCardComponent } from './issue-card/issue-card.component';
import { ToolViewComponent } from './tool-view/tool-view.component';
import { StatBadgeComponent } from './stat-badge/stat-badge.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';

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
        ItemListComponent,
        ItemCardComponent,
        IssueListComponent,
        IssueNavComponent,
        IssueCardComponent,
        ToolViewComponent,
        StatBadgeComponent,
        CodeEditorComponent,
    ]
})
export class ToolPageModule { }
