import { Injectable } from '@angular/core';
import { KatanaService } from './katana.service';
import { Router } from '@angular/router';

export interface DiscoverOption {
    title: string,
    key: string,
    description: string,
    type: string,
    choices: object[],
    defaultText?: string,
    required: boolean
}

export interface Tool {
    id: string,
    title: string,
    description: string,
    icon: string,
    categories: string[],
    discoverOptions: DiscoverOption[],
    fixOptions: object[],
};

@Injectable({
    providedIn: 'root'
})

export class ToolService {

    processing: boolean = false;
    processingMessage: string = '';
    toolViewOpen: boolean = false;

    // The Tool List (set immediately by Katana service when server is live)
    toolList: Tool[] = [];

    categories = [{
        icon: 'insert_drive_file',
        title: 'Pages',
        type: 'pages'
    }, {
        icon: 'assignment',
        title: 'Assignments',
        type: 'assignments'
    }, {
        icon: 'attach_file',
        title: 'Files',
        type: 'files'
    }, {
        icon: 'folder',
        title: 'Folders',
        type: 'folders'
    }, {
        icon: 'question_answer',
        title: 'Discussions',
        type: 'discussions'
    }, {
        icon: 'view_agenda',
        title: 'Modules',
        type: 'modules'
    }, {
        icon: 'view_list',
        title: 'Module Items',
        type: 'moduleItems'
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
        icon: 'code',
        title: 'HTML',
        type: 'html'
    }, {
        icon: 'settings',
        title: 'Course Settings',
        type: ''
    }];

    selectedCategory: object;
    selectedTool: Tool;
    selectedDiscoverOptions;
    selectedFixOptions;


    constructor(private router: Router) {
        let loc = window.location.href;

        // If we're on a tool selection screen, set the selected category
        if (loc.includes('tools?') && loc.includes('category=')) {
            this.selectedCategory = this.categories.find(category => category.type === loc.split('category=')[1].split('&')[0]);
        } else if (!loc.includes('options') && !this.selectedCategory) {
            router.navigate(['/']);
        }

        // If we're on an options page, set the selected tool
        if (loc.includes('/options')) {
            let toolId = loc.split('tools/')[1].split('/options')[0];
            this.selectedTool = this.toolList.find(tool => tool.id === toolId);
        }
    }
}
