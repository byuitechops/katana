import { Injectable } from '@angular/core';

/**
 * Handles user settings, such as the theme.
 */
@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    themes = {
        classic: {
            'cobalt': '#2879B5',
            'navy': '#183A54',
            'navy-light': '#2D4B63',
            'mint': '#c3ffe3',
            'charcoal': '#65727D',
            'ashen': '#eceff1',
        },
        charcoal: {
            'cobalt': '#65727D',
            'navy': '#1C2023',
            'navy-light': '#252A2E',
            'mint': '#c3ffe3',
            'charcoal': '#65727D',
            'ashen': '#eceff1',
        },
        navy: {
            'cobalt': '#183A54',
            'navy': '#2D4B63',
            'navy-light': '#2D4B9f',
            'mint': '#c3ffe3',
            'charcoal': '#65727D',
            'ashen': '#eceff1',
        }
    }

    constructor() { }

    /**
     * Toggles the theme between dark and light.
     */
    setTheme(newTheme) {
        localStorage.katanaTheme = newTheme;
        Object.keys(this.themes[newTheme]).forEach(key => {
            document.documentElement.style.setProperty(`--${key}`, this.themes[newTheme][key]);
        });
    }
}
