import { Injectable } from '@angular/core';

/**
 * Handles user settings, such as the theme.
 */
@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    /** @ignore */
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
        'Trimming',
        'Typing',
        'Thinking',
        'Contemplating',
        'Ordering',
        'Internetting',
        'Googling',
        'Yahooing',
        'Firefoxing',
        'Chroming',
        'Operating',
        'Candidating',
        'Evicting',
        'De-Horcruxing',
        'Charming',
        'Levitating',
        'Meditating with',
        'Lasering',
        'Purifying',
        'Burninating',
        'Pro-rating',
        'Rubber ducking',
        'Pranking'
    ];

    /** @ignore */
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
        'swordfish',
        'sketchers',
        'whatchamacallits',
        'jedi',
        'sith',
        'wizards',
        'maiar',
        'hobbits',
        'rangers',
        'elves',
        'urukai',
        'rubber ducks',
        'sushi',
        'fishies',
        'unicorns',
        'xylophones',
        'saxophones',
        'lightsabers',
        'blasters',
        'jetpacks',
        'whiteboards',
        'doctors',
        'chemists',
        'programmers',
        'hackers',
        'bananas',
        'rabbits',
        'ligers',
        'hippos',
        'shazams',
        'flex tape',
        'mix tapes',
        'sea pancakes',
        'snowmen',
        'katanas'
    ];

    /** @ignore */
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
        'productive',
        'general',
        'vermillion',
        'tickle-me-pink',
        'fluffy',
        'spunky',
        'toothpaste-fresh',
        'spudtastic',
        'dank',
        'janky',
        'radical',
        'wizard',
        'that\'s-so-raven',
        'sharp',
        'inumerable',
        'fresh',
        'forward',
        'backward',
        'mirrored',
        'entifiable',
        'Daniel\'d',
        'shocked',
        'unbelievable',
        'inconceivable',
        'conceivable',
        'incomprehensible',
        'comprehensible',
        'normie',
        'randy',
        'scrub',
        'salty',
        'OP',
        'practical',
    ];

    /**
     * The themes that can be set. Set by using the `setTheme()` method on this service.
     */
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
    };

    /** Constructor */
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
    getRandom(arr) {
        const randy = Math.floor(Math.random() * arr.length);
        return arr[randy];
    }

    /**
     * @ignore
     */
    buildProcessingMessage() {
        return `${this.getRandom(this.processingVerbs)} ${this.getRandom(this.processingAdjectives)} ${this.getRandom(this.processingNouns)}...`;
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
