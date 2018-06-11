import { Component } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CourseService, IssueItem } from './course.service';
import { toast } from 'angular2-materialize';
import { KatanaService } from './katana.service';
import { ToastService } from './toast.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    /***************************************************************************************
     * Constructor for the AppComponent class. Listens for the "NavigationEnd" event
     * on the Router, and then clears the selectedItem and selectedCourse values
     * from the Issues service if the user is not on a tool view page.
     * @param router 
     * @param courseService 
     * Process:
     * 1. Subscribe to the events from the router
     * 2. If the "NavigationEnd" event fires and they are no longer on a tool-view route
     * 3. Set the CourseService values for selectedItem and selectedCourse to null
     ***************************************************************************************/
    constructor(private router: Router,
        private route: ActivatedRoute,
        private courseService: CourseService,
        private katanaService: KatanaService,
        private toastService: ToastService) {


        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd &&
                !event.urlAfterRedirects.includes('/issues')) {
                courseService.selectedIssueItem = null;
                courseService.selectedCourse = null;
            } else if (event instanceof NavigationEnd &&
                event.urlAfterRedirects.includes('/issues')) {
                if (courseService.courses.length > 0) {
                    courseService.selectedCourse = courseService.courses[0];
                }
            }
        });

        // Retrieve the tool list on start
        this.katanaService.getToolList()
            .catch((e) => {
                this.toastService.devMode = true;
                this.toastService.toast('You are in development mode.');
                console.error(e);
            });
    }

    title = 'app';
}
