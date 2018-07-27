import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';
import { RouterModule } from '@angular/router';
import { CourseSelectionComponent } from './course-selection/course-selection.component';
import { CourseTabsComponent } from './course-tabs/course-tabs.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterializeModule
    ],
    exports: [
        CourseTabsComponent
    ],
    declarations: [
        CourseSelectionComponent,
        CourseTabsComponent
    ]
})
export class CourseTabsModule { }
