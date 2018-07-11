import { Injectable } from '@angular/core';
import { KatanaService } from './katana.service';
import { Router } from '@angular/router';

/**
 * Interface for an option used for a tool's discovery mode.
 * Displayed on the options page for the tool.
 */
export interface DiscoverOption {
    /** The title of the option */
    title: string,
    /** The key used to identify the option in the form */
    key: string,
    /** The description to display to the user for the option */
    description: string,
    /** The input type. Available types are "text", "dropdown", and "multiselect." */
    type: string,
    /** The available choices for the option (not applicable to "text" type) */
    choices: object[],
    /** The default text for "text" type options */
    defaultText?: string,
    /** Whether or not it is a required option on the form */
    required: boolean
}

/**
 * Interface for an option used for a tool's fix mode.
 * Displayed on each issue discovered by the tool.
 */
export interface FixOption {
    /** The title for the option */
    title: string,
    /** The key used to identify the option in the form */
    key: string,
    /** The description to display to the user */
    description: string,
    /** The input type. Available types are "text", "dropdown", and "multiselect." */
    type: string,
    /** The available choices for the option (not applicable to "text" type) */
    choices: object[],
    /** Default text for "text" type options */
    defaultText?: string,
    /** Whether or not the option is required in the form */
    required: boolean
}

/**
 * Interface for a tool available from the server.
 */
export interface Tool {
    /** The ID used to identify the tool */
    id: string,
    /** The title of the tool (displayed to the user) */
    title: string,
    /** Description of the tool's uses */
    description: string,
    /** MCIcon used to represent the tool in the {@link ToolSelectionComponent} */
    icon: string,
    /** Categories this tool will affect in Canvas (Pages, Discussions, Quizzes, etc.)*/
    categories: string[],
    /** The category this tool belongs to and will display in through the {@link CategoriesComponent} */
    toolCategory: string,
    /** {@link DiscoverOption}s for this tool, used to generate the options page */
    discoverOptions: DiscoverOption[],
    /** {@link FixOption}s for this tool, used to generate the options on each {@link IssueContainerComponent} */
    fixOptions: FixOption[],
    /** The message to display at the bottom of each {@link IssueContainerComponent} when the issue has been fixed */
    fixMessage?: string
};

/**
 * Interface for a category. Tools are categorized based
 * on their purpose. Each category is displayed on the 
 * home page.
 */
export interface Category {
    /** The MDIcon used to represent the category in the {@link CategoriesComponent} */
    icon: string,
    /** The title of the category */
    title: string,
    /** The string used by tools to identify the category they belong to */
    toolCategory: string
}

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
    processing: boolean = false;
    /**
     * The message to display on the screen while a tool is processing.
     */
    processingMessage: string = '';
    /**
     * Whether or not the user is currently looking at the tool view.
     */
    toolViewOpen: boolean = false;

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
