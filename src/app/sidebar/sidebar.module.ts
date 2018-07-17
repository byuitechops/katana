import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';
import { RouterModule } from '@angular/router';

import { CourseSidebarComponent } from './course-sidebar/course-sidebar.component';
import { CourseSelectionComponent } from './course-selection/course-selection.component';
import { CourseChipComponent } from './course-chip/course-chip.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterializeModule
    ],
    exports: [
        CourseSidebarComponent
    ],
    declarations: [
        CourseSidebarComponent,
        CourseSelectionComponent,
        CourseChipComponent
    ]
})
export class SidebarModule { }
