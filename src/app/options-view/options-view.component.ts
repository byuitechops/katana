import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToolService, DiscoverOption } from '../tool.service';

@Component({
    selector: 'app-options-view',
    templateUrl: './options-view.component.html',
    styleUrls: ['./options-view.component.css']
})

export class OptionsViewComponent {

    options = this.toolService.selectedTool.discoverOptions || [];
    optionModel = new OptionModel(this.options);
    formGroup = this.optionModel.toGroup();

    constructor(public toolService: ToolService,
        private router: Router) { }














    /******************************************************************************
     * Creates an option on the options page based on the options provided by the
     * currently selected tool.
     * @param {DiscoverOption} option - The options object passed in by the tool
     * @returns {string} - The HTML to be inserted into the DOM
     *****************************************************************************/
    createOption(option) {

        var choices = option.choices.reduce((acc, choice) => {
            return acc += `<option value="${choice.key}" ${option.defaults.includes(choice.key) ? 'selected' : ''}>${choice.text}</option>`
        }, '');

        let builders = {
            'text': `
          <h4>${option.title}</h4>
          <label for="option.title">${option.description}</label>
          <input type="text" name="${option.title}" ${option.required ? 'required' : ''}>
        `,
            'dropdown': `
          <h4>${option.title}</h4>
          <label for="option.title">${option.description}</label>
          <select name="${option.title}" style="display: block" ${option.required ? 'required' : ''}>
            ${choices}
          </select>
        `,
            'multiselect': `
          <h4>${option.title}</h4>
          <label for="option.title">${option.description}</label>
          <select name="${option.title}" style="display: block" multiple ${option.required ? 'required' : ''}>
            ${choices}
          </select>
        `
        }
        return builders[option.type];
    }

    /******************************************************************************
     * Fires when the options form is submitted. This builds the options object
     * to be used by the Katana service in communicating with the server.
     *****************************************************************************/
    onSubmit() {
        let textInputs: any = document.querySelectorAll('#optionsForm input');
        let selectInputs: any = document.querySelectorAll('#optionsForm select');
        let options = [];

        textInputs.forEach(textInput => {
            let obj = {};
            obj[textInput.name] = textInput.value;
            options.push(obj);
        });

        selectInputs.forEach(selectInput => {
            Array.from(selectInput.selectedOptions).forEach(selectedOption => {
                let obj = {};
                obj[selectInput.name] = selectedOption['value'];
                options.push(obj);
            });
        });

        // Send somewhere
        console.log(options);
    }

    /******************************************************************************
     * Navigates the user to the issues page for the currently running tool.
     * CHANGE: This will probably be removed soon.
     *****************************************************************************/
    navToIssues() {
        this.router.navigate([`categories/tools/${this.toolService.selectedTool.id}/issues`]);
    }
}

class OptionModel {
    options = [];

    constructor(options) {
        this.options = options;
    }
    toGroup() {
        let group: any = {};
        this.options.forEach((option) => {
            if (option.required) {
                group[option.key] = new FormControl('', Validators.required);
            }
            else {
                group[option.key] = new FormControl('');
            }
        });
        return new FormGroup(group);
    }
}
