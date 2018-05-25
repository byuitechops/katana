import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import 'materialize-css';
import { MaterializeModule } from "angular2-materialize";

/* Katana Components */
import { AppComponent } from './app.component';
import { CourseSidebarComponent } from './course-sidebar/course-sidebar.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueCardComponent } from './issue-card/issue-card.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';
import { IssueApprovalComponent } from './issue-approval/issue-approval.component';
import { IssueViewComponent } from './issue-view/issue-view.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { CategoriesComponent } from './categories/categories.component';
import { ToolViewComponent } from './tool-view/tool-view.component';
import { CourseSearchComponent } from './course-search/course-search.component';
import { GroupSidebarComponent } from './group-sidebar/group-sidebar.component';
import { CourseChipComponent } from './course-chip/course-chip.component';

const appRoutes: Routes = [
  { path: '', component: CategoriesComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'tool-view', component: ToolViewComponent },
  { path: 'course-search', component: CourseSearchComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CourseSidebarComponent,
    IssueListComponent,
    IssueCardComponent,
    IssueDetailsComponent,
    IssueApprovalComponent,
    IssueViewComponent,
    BreadcrumbsComponent,
    CategoriesComponent,
    ToolViewComponent,
    CourseSearchComponent,
    GroupSidebarComponent,
    CourseChipComponent,
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
