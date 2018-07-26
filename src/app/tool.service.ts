import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Tool, Category } from './interfaces';

/**
 * The Tool Service contains information and management for
 * all tools available from the service. It handles information
 * like which tool is currently selected, whether or not the user
 * is currently using a tool, and what categories are available to
 * the user.
 */
@Injectable({
    providedIn: 'root'
})
export class ToolService {

    /**
     * The categories available to the user. This will be replaced with
     * dynamic generation at a later point.
     */
    categories = [{
        icon: 'code',
        title: 'HTML',
        toolCategory: 'html'
    }, {
        icon: 'settings',
        title: 'Item Settings',
        toolCategory: 'itemSettings'
    }];

    /**
     * Whether or not a tool is currently doing it's magic.
     */
    processing = false;
    /**
     * The message to display on the screen while a tool is processing.
     */
    processingMessage = '';
    /**
     * Whether or not the user is currently looking at the tool view.
     */
    toolViewOpen = false;

    /**
     * The list of available tools, as retrieved from the server.
     */
    toolList: Tool[] = [];

    /**
     * The category selected by the user.
     */
    _selectedCategory: Category;
    /**
     * The tool selected by the user.
     */
    _selectedTool: Tool;
    /**
     * The discovery options chosen by the user on the options page for the selected tool.
     */
    selectedDiscoverOptions;

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

    /**
     * Constructor
     * @param router Used to navigate the user as needed.
     */
    constructor(private router: Router) {

        const loc = window.location.href;

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
