import { FormControl, Validators, FormGroup } from '@angular/forms';

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
        const group: any = {};
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
