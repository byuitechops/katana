import { Component } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CourseService, IssueItem } from './course.service';
import { KatanaService } from './katana.service';
import { ToastService } from './toast.service';
import { ToolService } from './tool.service';
import { AuthGuardService } from './auth/authguard.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    /***************************************************************************************
     * Constructor for the AppComponent class. Sets up listeners to handle route changes,
     * clearing out data to prevent issues between routes.
     ***************************************************************************************/
    constructor(private router: Router,
        private courseService: CourseService,
        private katanaService: KatanaService,
        private toolService: ToolService,
        private toastService: ToastService,
        private authGuardService: AuthGuardService) {

        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd &&
                !event.urlAfterRedirects.includes('/issues')) {

                // RESET all properties not used outside of tool view

                courseService.selectedIssueItem = null;
                courseService.selectedCourse = null;
                toolService.toolViewOpen = false
                toolService.selectedDiscoverOptions = false;
                courseService.courses.forEach(course => {
                    course.issueItems = [];
                    course.processing = false
                });

                document.documentElement.style.setProperty(`--course-sidebar-width`, '112px');
                document.documentElement.style.setProperty(`--course-chip-width`, '92px');

                // Clear out the web sockets in case any are still running
                katanaService.sockets.forEach(socket => socket.close());
                katanaService.sockets = [];

            } else if (event instanceof NavigationEnd &&
                event.urlAfterRedirects.includes('/issues')) {

                if (!toolService.selectedTool) {
                    router.navigate(['/']);
                    return;
                }

                if (toolService.selectedDiscoverOptions === false) {
                    router.navigate([`home/tools/${this.toolService.selectedTool.id}/options`]);
                    toastService.toast('You\'ll need to run the tool again to go back to the Issues page.');
                }

                // Select the first course and adjust the bar width
                if (courseService.courses.length > 0) {
                    courseService.selectedCourse = courseService.courses[0];
                    document.documentElement.style.setProperty(`--course-sidebar-width`, '340px');
                    document.documentElement.style.setProperty(`--course-chip-width`, '330px');
                }

                // Set the toolView tracking prop to true, all others off
                toolService.toolViewOpen = true;
                courseService.courseEditOpen = false;
                courseService.courseSelectionOpen = false;

            }
        });

        // Retrieve the tool list on start
        this.katanaService.getToolList()
            .catch((e) => {
                this.toastService.devMode = true;
                this.toastService.toast('You are in development mode.');
                console.error(e);
            });

        // Set the saved courses they had last selected as the currently selected courses
        Object.keys(sessionStorage).forEach(key => {
            if (key.includes('katana_course')) {
                let course = JSON.parse(sessionStorage[key]);
                this.courseService.addCourse(course);
            }
        });
    }

    title = 'app';
}
