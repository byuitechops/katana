import { Component } from '@angular/core';
import { KatanaService } from '../../server.service'; // Being used in error-page.component.html (i.e. DO NOT DELETE)

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {
    
    /** **********************************************************
     * Constructor
     * @param katanaService Collects errors in Katana and allows
     * them to be read and displayed to the user. Being used in 
     * error-page.component.html (i.e. DO NOT DELETE)
     ************************************************************/
    constructor(private katanaService: KatanaService) { }

}
