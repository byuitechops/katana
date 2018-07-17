import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';

import { CategoriesComponent } from './categories/categories.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ToolSelectionComponent } from './tool-selection/tool-selection.component';
import { OptionsViewComponent } from './options-view/options-view.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterializeModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        BreadcrumbsComponent,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        BreadcrumbsComponent,
        CategoriesComponent,
        ToolSelectionComponent,
        OptionsViewComponent
    ]
})
export class HomePageModule { }
