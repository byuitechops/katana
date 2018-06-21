import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';
import { CourseService } from '../course.service';

import { MaterializeAction } from 'angular2-materialize';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})

export class BreadcrumbsComponent implements OnInit {

    // This allows the modal to open and close
    modalActions = new EventEmitter<string | MaterializeAction>();

    breadcrumbs = [{
        url: '/',
        title: 'Home'
    }, {
        url: '/',
        title: 'Pages'
    }, {
        url: '/tool-view',
        title: 'Modify Attributes'
    }];

    /*****************************************************************
     * Opens and closes the modal. Populates the modal based on the input.
     * @param {string} contentKey - Should match one of the keys of the modalContents property on this component
     * Process:
     * 1. Sets the contents of the modal based on the provided contentKey
     * 2. Emits the "open" event for the modal (or close, for the close method)
     ****************************************************************/
    openModal() {
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }
    closeModal() {
        this.modalActions.emit({ action: "modal", params: ['close'] });
    }

    constructor(private router: Router, public toolService: ToolService, private courseService: CourseService) { }

    ngOnInit() { }

    buildRouterLink(pathPieces) {
        this.router.navigate(pathPieces);
        return false;
    }
}
