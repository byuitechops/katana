import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { CourseService } from './course.service';
import { KatanaService } from './server.service';
import { ToastService } from './toast.service';
import { ToolService } from './tool.service';
import { AuthGuardService } from './authguard.service'; // Being used in app.component.html (i.e. DO NOT DELETE)
import { SettingsService } from './settings.service';

/**
 * This is the main component for the entire application.
 * It holds the primary pieces that allow the user to
 * navigate from the top down.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    /**
     * Constructor. This creates subscriptions to routes changes to adjust values
     * as needed. For example, if the user navigates to the tool view (i.e. they ran
     * a tool), then many values in various services are removed or reset to prevent
     * conflicting values between services.
     *
     * This will also retrieve the list of tools from the Katana service when it is
     * created.
     *
     * @param router Used to navigate the user as needed.
     * @param courseService Provides information and management for selected courses.
     * @param katanaService Provides functionality for making API calls to the Katana server.
     * @param toolService Provides information and management for available tools.
     * @param toastService Provides toast notification functionality.
     * @param authGuardService Provides Firebase authentication functionality.
     * Being used in app.component.html (i.e. DO NOT DELETE)
     */
    constructor(private router: Router,
        private courseService: CourseService,
        private katanaService: KatanaService,
        private toolService: ToolService,
        private toastService: ToastService,
        private settingsService: SettingsService,
        private authGuardService: AuthGuardService) {

        // Set the theme
        if (localStorage['katanaTheme']) {
            settingsService.setTheme(localStorage['katanaTheme'])
        }

        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd &&
                !event.urlAfterRedirects.includes('/issues')) {

                // RESET all properties not used outside of tool view

                courseService.selectedIssueItem = null;
                courseService.selectedCourse = null;
                toolService.toolViewOpen = false;
                toolService.selectedDiscoverOptions = false;
                courseService.courses.forEach(course => {
                    course.issueItems = [];
                    course.processing = false;
                });

                // document.documentElement.style.setProperty(`--course-sidebar-width`, '112px');
                // document.documentElement.style.setProperty(`--course-chip-width`, '92px');

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
                    // document.documentElement.style.setProperty(`--course-sidebar-width`, '340px');
                    // document.documentElement.style.setProperty(`--course-chip-width`, '330px');
                }

                // Set the toolView tracking prop to true, all others off
                toolService.toolViewOpen = true;
                courseService.courseSelectionOpen = false;

            }
        });

        // Set the saved courses they had last selected as the currently selected courses
        Object.keys(sessionStorage).forEach(key => {
            if (key.includes('katana_course')) {
                const course = JSON.parse(sessionStorage[key]);
                this.courseService.addCourse(course);
            }
        });
    }
}
