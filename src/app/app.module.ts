import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CourseSidebarComponent } from './course-sidebar/course-sidebar.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueCardComponent } from './issue-card/issue-card.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';
import { IssueApprovalComponent } from './issue-approval/issue-approval.component';
import { IssueViewComponent } from './issue-view/issue-view.component';

@NgModule({
  declarations: [
    AppComponent,
    CourseSidebarComponent,
    IssueListComponent,
    IssueCardComponent,
    IssueDetailsComponent,
    IssueApprovalComponent,
    IssueViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
