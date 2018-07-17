import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';
import 'rxjs';

/* Firebase */
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './firebase.auth';
import { AuthGuardService } from './authguard.service';

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
import { ToolSelectionComponent } from './tool-selection/tool-selection.component';
import { OptionsViewComponent } from './options-view/options-view.component';
import { StatBadgeComponent } from './stat-badge/stat-badge.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';

export const appRoutes: Routes = [
    {
        path: 'categories',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: CategoriesComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'home/tools',
        component: ToolSelectionComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'home/tools/:tool_id/options',
        component: OptionsViewComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'home/tools/:tool_id/issues',
        component: ToolViewComponent,
        canActivate: [AuthGuardService]
    }
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
        ToolSelectionComponent,
        OptionsViewComponent,
        StatBadgeComponent,
        CodeEditorComponent,
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes
        ),
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        MaterializeModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        AuthGuardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
