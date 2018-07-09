import { Injectable } from '@angular/core';
import { toast } from 'angular2-materialize';

/**
 * Provides methods to notify the user of errors and various message
 * via toast notification.
 */
@Injectable({
    providedIn: 'root'
})
export class ToastService {

    /**
     * Constructor
     */
    constructor() { }

    /**
     * Displays an error to the user via toast notification.
     * @param {Error} e Error to display
     */
    toastError(e) {
        function buildHTML(message) {
            return `
                <span style="color:red !important">${message}</span>
                <button onclick="document.querySelector('.toast').remove()" class="btn-flat toast-action">
                    Dismiss
                </button>
            `;
        }
        // If just text is sent in
        let text = e;

        // Classic Error
        if (e instanceof Error) {
            text = e.message;

            // If a web socket goes down unexpectedly
        } else if (e instanceof Event && e.target instanceof WebSocket && (e.target.readyState === 3 || e.target.readyState === 2)) {
            text = 'Websocket unexpectedly closed. Server may be down.';
        }
        toast(buildHTML(text));
        setTimeout(() => {
            document.querySelector('.toast').remove();
        }, 15000);
    }

    /**
     * Displays a message to the user via toast notification.
     * @param {string} text Message to display
     */
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
