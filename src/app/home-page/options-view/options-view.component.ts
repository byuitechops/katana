import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../../tool.service';
import { CourseService } from '../../course.service';
import { ServerService } from '../../server.service';
import { MaterializeAction } from 'angular2-materialize';
import { FormGroup } from '@angular/forms';
import { DiscoverOption } from '../../interfaces';
import { OptionModel } from '../../classes';

/**
 * Container for the options page. Holds all related
 * options components.
 */
@Component({
    selector: 'app-options-view',
    templateUrl: './options-view.component.html',
    styleUrls: ['./options-view.component.css']
})
export class OptionsViewComponent {

    /**
     * The options to display on the page.
     */
    options: DiscoverOption[];
    /**
     * The {@link OptionModel} to use for the form.
     */
    optionModel: OptionModel;
    /**
     * The FormGroup to use for the form.
     */
    formGroup: FormGroup;

    /**
     * From [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize},
     * which allows the modal to open and close.
     */
    modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();

    /**
     * Constructor
     * @param {ToolService} toolService Provides information and management for available courses.
     * @param {ServerService} serverService Provides functionality to make API calls to the Katana server.
     * @param {CourseService} courseService Provides information and management for selected courses.
     * @param {Router} router Used to navigate the user as needed.
     */
    constructor(public toolService: ToolService,
        public serverService: ServerService,
        public courseService: CourseService,
        private router: Router) {

        this.optionModel = new OptionModel(this.toolService.selectedTool.discoverOptions);
        this.formGroup = this.optionModel.toGroup();
    }

    /**
     * Opens the modal using [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize}.
     */
    openModal(): void {
        this.modalActions.emit({ action: 'modal', params: ['open'] });
    }

    /**
     * Closes the modal using [angular2-materialize]{@link https://www.npmjs.com/package/angular2-materialize}.
     */
    closeModal(): void {
        this.modalActions.emit({ action: 'modal', params: ['close'] });
    }

    /**
     * Determines the open/close status of the "no courses selected" modal.
     * @returns {boolean} Whether or not the modal is currently open.
     */
    noCourseModalOpen(): boolean {
        return !!document.querySelector('#fixModal.open');
    }

    /**
     * Actions taken when the user clicks the "Run Tool" button.
     * Gathers up the answers on the options form, then submits
     * them to the Katana Service to run the tool in discovery mode.
     */
    onSubmit(): void {
        if (this.courseService.courses.length === 0) {
            this.openModal();
            return;
        }

        const options = { categories: [] };
        Object.keys(this.formGroup.controls).forEach(key => {
            options[key] = this.formGroup.controls[key].value;
        });

        const categoryInputs = Array.from(document.querySelectorAll('.canvas-category')) as HTMLInputElement[];
        categoryInputs.forEach(category => {
            if (category.checked) {
                options.categories.push(category.id);
            }
        });

        // Send request
        this.toolService.selectedDiscoverOptions = options;
        this.serverService.discoverIssues(this.courseService.courses)
            .catch(console.error);
        this.router.navigate([`home/tools/${this.toolService.selectedTool.id}/issues`]);
    }

}
