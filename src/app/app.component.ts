import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { IssuesService, IssueItem } from './issues.service';
import { CoursesService } from './courses.service';
import { KatanaService } from './katana.service';

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
        private coursesService: CoursesService,
        private issuesService: IssuesService,
        private katanaService: KatanaService) {

        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd &&
                !event.urlAfterRedirects.includes('tool-view')) {
                issuesService.selectedItem = null;
                issuesService.selectedCourse = null;
            }
        });
    }

    // TESTING This function will be removed
    testRunDiscover() {
        this.katanaService.discoverIssues('equella_links', {

        }).then((issueItems: IssueItem[]) => {
            console.log('DISCOVERED', issueItems);
            this.issuesService.issueItems = issueItems;
        }).catch(console.error);
    }

    // TESTING This function will be removed
    testRunFix() {
        this.katanaService.fixIssues('equella_links', {

        }).then((issueItems: IssueItem[]) => {
            console.log('FIXED', issueItems);
            this.issuesService.issueItems = issueItems;
        }).catch(console.error);
    }

    title = 'app';
}
