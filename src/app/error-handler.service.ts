import { Injectable } from '@angular/core';
import { toast } from 'angular2-materialize';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {

    devMode: boolean = false;

    constructor() { }

    toastError(e) {

        function buildHTML(message) {
            return `
                <span>${message}</span>
                <button onclick="document.querySelector('.toast').remove()" class="btn-flat toast-action">
                    Dismiss
                </button>
            `;
        }


        toast(buildHTML(e.message));
    }
}
