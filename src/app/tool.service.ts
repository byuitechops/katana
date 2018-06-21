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

    processing: boolean = false;
    processingMessage: string = '';
    toolViewOpen: boolean = false;

    // The Tool List (set immediately by Katana service when server is live)
    toolList: Tool[] = [];

    _selectedCategory: Category;
    _selectedTool: Tool;
    selectedDiscoverOptions;
    selectedFixOptions;

    get selectedCategory() {
        return this._selectedCategory;
    }

    set selectedCategory(category) {
        sessionStorage.selectedCategory = category.title;
        this._selectedCategory = category;
    }

    get selectedTool() {
        return this._selectedTool;
    }

    set selectedTool(tool) {
        sessionStorage.selectedTool = tool.id;
        this._selectedTool = tool;
    }

    constructor(private router: Router) {
        let loc = window.location.href;

        if (loc.includes('options') && !this._selectedTool && sessionStorage.selectedTool) {
            this._selectedTool = this.toolList.find(tool => tool.id === sessionStorage.selectedTool);
        }

        if (loc.includes('tools') && !this._selectedCategory && sessionStorage.selectedCategory) {
            this._selectedCategory = this.categories.find(category => category.title === sessionStorage.selectedCategory);
        }

        // I don't feel like this is the right place for this...
        if (loc.includes('options') && !this._selectedTool) {
            router.navigate(['/']);
        }

        // I don't feel like this is the right place for this...
        if (loc.includes('tools') && !this._selectedCategory) {
            router.navigate(['/']);
        }
    }
}
