import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { OptionModel } from '../options.service';
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

    options: DiscoverOption[];
    optionModel: OptionModel;
    formGroup;

    // This allows the modal to open and close
    modalActions = new EventEmitter<string | MaterializeAction>();
    modalOpen: boolean = false;

    constructor(public toolService: ToolService,
        public katanaService: KatanaService,
        private courseService: CourseService,
        private router: Router) {

        this.optionModel = new OptionModel(this.toolService.selectedTool.discoverOptions);
        this.formGroup = this.optionModel.toGroup();
    }

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

        // Send request
        this.toolService.selectedDiscoverOptions = options;
        this.katanaService.discoverIssues(this.courseService.courses)
            .catch(console.error);
        this.router.navigate([`home/tools/${this.toolService.selectedTool.id}/issues`]);
    }

}