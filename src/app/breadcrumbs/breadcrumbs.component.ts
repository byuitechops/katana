import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';
import { CourseService } from '../course.service';
import { auth } from 'firebase';
import { AuthGuardService } from '../auth/authguard.service';
import { MaterializeAction } from 'angular2-materialize';

/**
 * This is a test to see if Compodoc generates this comment.
 */
@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})

export class BreadcrumbsComponent {

    /**
     * Used to open and close the modal for feedback.
     */
    modalActions = new EventEmitter<string | MaterializeAction>();

    constructor(private router: Router,
        public toolService: ToolService,
        private courseService: CourseService,
        private authGuardService: AuthGuardService) { }

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

    /**
     * Builds a URL, then navigates the router to it.
     * @param pathPieces - Array of all parts of the path.
     * @returns boolean - Returns false to prevent full page reload.
     */
    buildRouterLink(pathPieces) {
        this.router.navigate(pathPieces);
        return false;
    }
}
