import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';
import { CourseService } from '../course.service';

import { MaterializeAction } from 'angular2-materialize';

/**
 * This is a test to see if Compodoc generates this comment.
 */
@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})

export class BreadcrumbsComponent implements OnInit {

    // This allows the modal to open and close
    modalActions = new EventEmitter<string | MaterializeAction>();

    /**
     * Opens the feedback modal.
     */
    openModal() {
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }

    /**
     * Closes the feedback modal.
     */
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
