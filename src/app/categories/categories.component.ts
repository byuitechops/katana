import { Component } from '@angular/core';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

    constructor(public toolService: ToolService) { }

    /************************************************************
     * This sets the selected category on the Tool service.
     * Note that this MUST return false, so it doesn't reload
     * the entire page, just the router-outlet.
     * @param {object} category - The category to set
     * @returns {false} - This is so it doesn't refresh the entire page
     ************************************************************/
    setSelectedCategory(category) {
        this.toolService.selectedCategory = category;
        return false;
    }

}
