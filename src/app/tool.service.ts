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

    // The Tool List (set immediately by Katana service)
    toolList: Tool[] = [{
        id: 'page_tool',
        title: 'A Page Tool',
        icon: 'settings',
        categories: ['Page'],
        discoverOptions: [{
            title: 'Page Title',
            key: 'pageTitle',
            description: 'Please insert the title of the page you are looking for.',
            type: 'text',
            choices: [],
            defaultText: 'Default Test',
            required: true
        }, {
            title: 'Module',
            key: 'module',
            description: 'Please select which module you would like to search in.',
            type: 'dropdown',
            choices: [{
                key: 'allModules',
                text: 'All Modules',
                default: false
            }, {
                key: 'instructorResources',
                text: 'Instructor Resources',
                default: true
            }, {
                key: 'studentResources',
                text: 'Student Resources',
                default: false
            }],
            required: true
        }, {
            title: 'Feelings',
            key: 'feelings',
            description: 'Because we looove discussing them...',
            type: 'multiselect',
            choices: [{
                key: 'nope1',
                text: 'Definitely Not',
                default: false
            }, {
                key: 'nope12',
                text: 'No',
                default: true
            }, {
                key: 'nope123',
                text: 'Nope',
                default: true
            }, {
                key: 'nope11',
                text: 'Definitely Not3',
                default: false
            }, {
                key: 'nope121',
                text: 'No1',
                default: false
            }, {
                key: 'nope1231',
                text: 'Nope2',
                default: true
            }],
            required: true
        }],
        fixOptions: [],
    }, {
        id: 'quiz_tool',
        title: 'A Quiz Tool',
        icon: 'settings',
        categories: ['Quiz'],
        discoverOptions: [],
        fixOptions: [],
    }, {
        id: 'discussion_tool',
        title: 'A Discussions Tool',
        icon: 'settings',
        categories: ['Discussion'],
        discoverOptions: [],
        fixOptions: [],
    }];

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
