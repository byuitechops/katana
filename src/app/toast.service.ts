import { Injectable } from '@angular/core';
import { toast } from 'angular2-materialize';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    devMode: boolean = false;
    constructor() { }

    toastError(e) {
        function buildHTML(message) {
            return `
                <span style="color:red !important">${message}</span>
                <button onclick="document.querySelector('.toast').remove()" class="btn-flat toast-action">
                    Dismiss
                </button>
            `;
        }
        var text = e.message;
        if (e.status === 0) {
            text = 'The server is not available. Please check with a Katana Admin.';
        }
        toast(buildHTML(text));
    }

    toast(text) {
        function buildHTML(message) {
            return `
                <span>${message}</span>
                <button onclick="document.querySelector('.toast').remove()" class="btn-flat toast-action">
                    Dismiss
                </button>
            `;
        }
        toast(buildHTML(text));
        setTimeout(() => {
            document.querySelector('.toast').remove();
        }, 5000);
    }
}
