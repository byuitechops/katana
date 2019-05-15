import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../../tool.service';
import { AuthGuardService } from '../../authguard.service'; // Being used in breadcrumbs.component.html (i.e. DO NOT DELETE)

/**
 * Builds the breadcrumbs for navigation, as well as the feedback and
 * user details in the navigation bar.
 */
@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent {

    /**
     * Constructor
     * @param router Used to verify current location and navigate user to new page.
     * @param toolService Used to verify currently selected tool.
     * @param authGuardService Enables Sign Out button. Being used in
     * breadcrumbs.component.html (i.e. DO NOT DELETE)
     */
    constructor(public router: Router,
        public toolService: ToolService,
        public authGuardService: AuthGuardService) { }

    /**
     * Builds a URL, then navigates the router to it.
     * @param pathPieces - Array of each piece of the path to navigate to.
     * @returns boolean - Returns false to prevent full page reload.
     */
    buildRouterLink(pathPieces) {
        this.router.navigate(pathPieces);
        return false;
    }
}
