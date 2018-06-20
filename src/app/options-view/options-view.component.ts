import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToolService, DiscoverOption } from '../tool.service';
import { CourseService } from '../course.service';
import { KatanaService } from '../katana.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
    selector: 'app-options-view',
    templateUrl: './options-view.component.html',
    styleUrls: ['./options-view.component.css']
})

export class OptionsViewComponent {

    options: DiscoverOption[] = this.toolService.selectedTool.discoverOptions || [];
    optionModel = new OptionModel(this.options);
    formGroup = this.optionModel.toGroup();

    // This allows the modal to open and close
    modalActions = new EventEmitter<string | MaterializeAction>();
    modalOpen: boolean = false;

    constructor(public toolService: ToolService,
        public katanaService: KatanaService,
        private courseService: CourseService,
        private router: Router) { }

    /*****************************************************************
     * Opens and closes the modal. Populates the modal based on the input.
     * @param {string} contentKey - Should match one of the keys of the modalContents property on this component
     * Process:
     * 1. Sets the contents of the modal based on the provided contentKey
     * 2. Emits the "open" event for the modal (or close, for the close method)
     ****************************************************************/
    openModal() {
        this.modalOpen = true;
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }
    closeModal() {
        this.modalOpen = false;
        this.modalActions.emit({ action: "modal", params: ['close'] });
    }

    modalIsOpen() {
        return !!document.querySelector('.modal-overlay');
    }

    onSubmit() {
        if (this.courseService.courses.length === 0) {
            this.openModal();
            return;
        }

        var options = { categories: [] };
        Object.keys(this.formGroup.controls).forEach(key => {
            options[key] = this.formGroup.controls[key].value;
        });

        let categoryInputs = Array.from(document.querySelectorAll('.canvas-category')) as HTMLInputElement[];
        categoryInputs.forEach(category => {
            if (category.checked) {
                options.categories.push(category.id);
            }
        });
        console.log(options);

        // Send request
        this.toolService.selectedDiscoverOptions = options;
        this.katanaService.discoverIssues()
            .catch(console.error);
        this.router.navigate([`categories/tools/${this.toolService.selectedTool.id}/issues`]);
    }

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
