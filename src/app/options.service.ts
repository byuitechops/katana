import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class OptionsService {
    constructor() { }
}

export class OptionModel {
    options = [];
    constructor(options) {
        this.options = options;
    }

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