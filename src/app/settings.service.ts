import { Injectable } from '@angular/core';

/**
 * Handles user settings, such as the theme.
 */
@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    processingVerbs = [
        'Diagnosing',
        'Encapsulating',
        'Sketching',
        'Airating',
        'Flipping',
        'Calculating',
        'Producing',
        'Kicking',
        'Slapping',
        'Prodding',
        'Aging',
        'Trimming'
    ];

    processingNouns = [
        'ninjas',
        'processors',
        'tombs',
        'desks',
        'files',
        'dancers',
        'people',
        'wyverns',
        'frogs',
        'developers',
        'pages',
        'discussions',
        'choreography',
        'gas bubbles',
        'swordfish',
        'sketchers'
    ];

    processingAdjectives = [
        'palpatating',
        'undulating',
        'moist',
        'electrical',
        'shadowy',
        'sketchy',
        'spinning',
        'freestyling',
        'gradiating',
        'radiating',
        'freaky',
        'superstitious',
        'italian',
        'saucy',
        'sassy',
        'productive'
    ];

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
        },
        hate: {
            'cobalt': 'limegreen',
            'navy': 'yellow',
            'navy-light': 'magenta',
            'mint': '#c3ffe3',
            'charcoal': '#65727D',
            'ashen': 'red',
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

    /**
     * @ignore
     */
    buildProcessingMessage() {
        function getRandom(arr) {
            let randy = Math.floor(Math.random() * arr.length);
            return arr[randy];
        }

        return `${getRandom(this.processingVerbs)} ${getRandom(this.processingAdjectives)} ${getRandom(this.processingNouns)}...`;
    }

    /**
     * @ignore
     */
    checkLocalStorage(key) {
        return localStorage[key] === 'true';
    }

    /**
     * @ignore
     */
    setLocalStorage(key) {
        localStorage[key] = localStorage[key] === 'true' ? 'false' : 'true';
    }
}
