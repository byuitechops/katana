import { Injectable } from '@angular/core';
import { KatanaService } from './katana.service';
import { Router } from '@angular/router';

export interface DiscoverOption {
    title: string,
    key: string,
    description: string,
    type: string,
    choices: object[],
    defaults: string[],
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
            defaults: [],
            required: true
        }, {
            title: 'Module',
            key: 'module',
            description: 'Please select which module you would like to search in.',
            type: 'dropdown',
            choices: [{
                key: 'allModules',
                text: 'All Modules'
            }, {
                key: 'instructorResources',
                text: 'Instructor Resources'
            }, {
                key: 'studentResources',
                text: 'Student Resources'
            }],
            defaults: ['allModules'],
            required: true
        }, {
            title: 'Feelings',
            key: 'feelings',
            description: 'Because we looove discussing them...',
            type: 'multiselect',
            choices: [{
                key: 'nope1',
                text: 'Definitely Not'
            }, {
                key: 'nope12',
                text: 'No'
            }, {
                key: 'nope123',
                text: 'Nope'
            }, {
                key: 'nope1',
                text: 'Definitely Not'
            }, {
                key: 'nope12',
                text: 'No'
            }, {
                key: 'nope123',
                text: 'Nope'
            }],
            defaults: ['nope123'],
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

    // The currently selected category (i.e. Page)
    selectedCategory: object;
    // The currently selected tool
    selectedTool;

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
