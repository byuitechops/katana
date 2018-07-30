import { Component } from '@angular/core';
import { ToolService } from '../../tool.service';
import { CourseService } from '../../course.service'; // Being used in categories.component.html (i.e. DO NOT DELETE)
import { Category } from '../../interfaces';

/** **********************************************************
 * Container for all available tool categories. Each {@link Category} is generated
 * based on the available tools.
 ************************************************************/
@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

    /** **********************************************************
     * Constructor
     * @param toolService Used to generate each available category
     * @param courseService Verifies if course selection is open, 
     * so styling can be applied. Used in 
     * categories.component.html (i.e. DO NOT DELETE)
     ************************************************************/
    constructor(public toolService: ToolService,
        private courseService: CourseService) { }

    /** **********************************************************
     * This sets the selected {@link Category} on the Tool service.
     * @param {object} category The category to be set as the selected category
     * @returns {false} Returns false to prevent the entire page (just the router) from reloading
     ************************************************************/
    setSelectedCategory(category: Category) {
        this.toolService.selectedCategory = category;
        return false;
    }
}
