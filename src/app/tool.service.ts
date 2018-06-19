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
    toolCategory: string,
    discoverOptions: DiscoverOption[],
    fixOptions: object[],
};

export interface Category {
    icon: string,
    title: string,
    toolCategory: string
}

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
        icon: 'code',
        title: 'HTML',
        toolCategory: 'html'
    }, {
        icon: 'title',
        title: 'Titles',
        toolCategory: 'titles'
    }, {
        icon: 'create',
        title: 'Create',
        toolCategory: 'create'
    }, {
        icon: 'delete_outline',
        title: 'Remove',
        toolCategory: 'remove'
    }, {
        icon: 'language',
        title: 'Course Settings',
        toolCategory: 'courseSettings'
    }, {
        icon: 'settings',
        title: 'Item Settings',
        toolCategory: 'itemSettings'
    }, {
        icon: 'explore',
        title: 'Syllabus',
        toolCategory: 'syllabus'
    }];

    selectedCategory: Category;
    selectedTool: Tool;
    selectedDiscoverOptions;
    selectedFixOptions;

    constructor(private router: Router) {
        let loc = window.location.href;

        // If we're on a tool selection screen, set the selected category
        if (loc.includes('tools?') && loc.includes('category=')) {
            this.selectedCategory = this.categories.find(category => category.toolCategory === loc.split('category=')[1].split('&')[0]);
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
