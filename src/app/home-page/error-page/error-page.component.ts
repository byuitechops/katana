import { Component } from '@angular/core';
import { KatanaService } from '../../katana.service';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

    constructor(private katanaService: KatanaService) { }

}
