import { Component } from '@angular/core';
import { KatanaService } from '../../katana.service'; // Being used in error-page.component.html (i.e. DO NOT DELETE)

/** An error page to display various client-side errors, and errors received from the server. */
@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

    /** **********************************************************
     * Constructor
     * @param katanaService Collects errors in Katana and allows
     * them to be read and displayed to the user. Used in 
     * error-page.component.html (i.e. DO NOT DELETE)
     ************************************************************/
    constructor(public katanaService: KatanaService) { }

}
