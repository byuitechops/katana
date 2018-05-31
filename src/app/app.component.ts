import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IssuesService } from './issues.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    /**
     * Constructor for the AppComponent class. Listens for the "NavigationEnd" event
     * on the Router, and then clears the selectedItem and selectedCourse values
     * from the Issues service if the user is not on a tool view page.
     * @param router 
     * @param issuesService 
     * Process:
     * 1. Subscribe to the events from the router
     * 2. If the "NavigationEnd" event fires and they are no longer on a tool-view route
     * 3. Set the IssuesService values for selectedItem and selectedCourse to null
     */
    constructor(private router: Router,
        private issuesService: IssuesService) {
        router.events.subscribe(event => {
            if (event.constructor.name === 'NavigationEnd' &&
                !event.urlAfterRedirects.includes('tool-view')) {
                issuesService.selectedItem = null;
                issuesService.selectedCourse = null;
            }
        });
    }

    title = 'app';
}
