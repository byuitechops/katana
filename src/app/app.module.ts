import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';
import 'rxjs';

/* Katana Components */
import { AppComponent } from './app.component';
import { CourseSidebarComponent } from './course-sidebar/course-sidebar.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueCardComponent } from './issue-card/issue-card.component';
import { IssueDetailsComponent } from './issue-details/issue-details.component';
import { IssueNavComponent } from './issue-nav/issue-nav.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { CategoriesComponent } from './categories/categories.component';
import { ToolViewComponent } from './tool-view/tool-view.component';
import { CourseSelectionComponent } from './course-selection/course-selection.component';
import { CourseChipComponent } from './course-chip/course-chip.component';
import { IssueContainerComponent } from './issue-container/issue-container.component';

const appRoutes: Routes = [
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
        IssueNavComponent,
        BreadcrumbsComponent,
        CategoriesComponent,
        ToolViewComponent,
        CourseSelectionComponent,
        CourseChipComponent,
        IssueContainerComponent,
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes
        ),
        BrowserModule,
        HttpClientModule,
        MaterializeModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
