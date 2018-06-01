import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    categories = [{
        icon: 'insert_drive_file',
        title: 'Pages',
        type: 'Page'
    }, {
        icon: 'assignment',
        title: 'Assignments',
        type: 'Assignment'
    }, {
        icon: 'attach_file',
        title: 'Files',
        type: 'File'
    }, {
        icon: 'folder',
        title: 'Folders',
        type: 'Folder'
    }, {
        icon: 'question_answer',
        title: 'Discussions',
        type: 'Discussion'
    }, {
        icon: 'view_agenda',
        title: 'Modules',
        type: 'Module'
    }, {
        icon: 'view_list',
        title: 'Module Items',
        type: 'ModuleItem'
    }, {
        icon: 'gavel',
        title: 'Quizzes',
        type: 'Quiz'
    }, {
        icon: 'help_outline',
        title: 'Quiz Questions',
        type: 'QuizQuestion'
    }, {
        icon: 'explore',
        title: 'Syllabus',
        type: 'Syllabus'
    }, {
        icon: 'language',
        title: 'Course Wide',
        type: ''
    }, {
        icon: 'settings',
        title: 'Course Settings',
        type: ''
    }];

    constructor(private toolService: ToolService) {

    }

    /************************************************************
     * This sets the selected category on the Tool service.
     * Note that this MUST return false, so it doesn't reload
     * the entire page, just the router-outlet.
     * @param {object} category - The category to set
     * @returns {false} - This is so it doesn't refresh the entire page
     ************************************************************/
    setSelectedCategory(category) {
        this.toolService.selectedCategory = category.type;
        console.log(this.toolService.selectedCategory);
        return false;
    }

    ngOnInit() { }
}
