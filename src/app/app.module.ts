import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';
import 'rxjs';

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
import { CourseSelectionComponent } from './course-selection/course-selection.component';
import { CourseChipComponent } from './course-chip/course-chip.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: CategoriesComponent,
        data: {
            breadcrumb: 'Home'
        }
    },
    {
        path: 'categories',
        component: CategoriesComponent,
        data: {
            breadcrumb: 'Categories'
        }
    },
    {
        path: 'tool-view',
        component: ToolViewComponent,
        data: {
            breadcrumb: 'Tool View'
        }
    },
    {
        path: 'course-selection',
        component: CourseSelectionComponent,
        data: {
            breadcrumb: 'Course Selection'
        }
    },
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
        CourseSelectionComponent,
        CourseChipComponent,
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true } // <-- debugging purposes only
        ),
        BrowserModule,
        MaterializeModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
