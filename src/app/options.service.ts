import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

/**
 * This service will be replaced with just the OptionModel class. The
 * service is pointless.
 */
@Injectable({
    providedIn: 'root'
})
export class OptionsService {
    /**
     * @ignore
     */
    constructor() { }
}

/**
 * Helper for building a reactive form. Used to create the
 * {@link FormGroup} and {@link FormControl}s needed for
 * both the {@link OptionsViewComponent} and the options on
 * each {@link IssueContainerComponent}.
 */
export class OptionModel {

    /**
     * Options to build the form from.
     */
    options = [];

    /**
     * Constructor
     * @param options Options to build the form from.
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * Takes the provided options and puts them into a new {@link FormGroup}.
     */
    toGroup() {
        let group: any = {};
        this.options.forEach((option) => {
            if (option.required) {
                group[option.key] = new FormControl('', Validators.required);
            } else {
                group[option.key] = new FormControl('');
            }
        });
        return new FormGroup(group);
    }
}