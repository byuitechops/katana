import { FormGroup } from '@angular/forms';
import { OptionModel } from './classes';

/**
 * Interface for an option used for a tool's discovery mode.
 * Displayed on the options page for the tool.
 */
export interface DiscoverOption {
    /** The title of the option */
    title: string;
    /** The description to display to the user for the option */
    description: string;
    /** The key used to identify the option in the form */
    key: string;
    /** The input type. Available types are "text", "dropdown", and "multiselect." */
    type: string;
    /** The available choices for the option (not applicable to "text" type) */
    choices?: object[];
    /** The default text for "text" type options */
    defaultText?: string;
    /** Whether or not it is a required option on the form */
    required: boolean;
}

/**
 * Interface for an option used for a tool's fix mode.
 * Displayed on each issue discovered by the tool.
 */
export interface FixOption {
    /** The title for the option */
    title: string;
    /** The description to display to the user */
    description: string;
    /** The key used to identify the option in the form */
    key: string;
    /** The input type. Available types are "text", "dropdown", and "multiselect." */
    type: string;
    /** The available choices for the option (not applicable to "text" type) */
    choices?: object[];
    /** Default text for "text" type options */
    defaultText?: string;
    /** Whether or not the option is required in the form */
    required: boolean;
}

/**
 * Interface for a tab to be generated on the HTML editor
 */
export interface EditorTab {
    /** The title of the tab */
    title: string;
    /** The key to use to grab the html string off the issue */
    htmlKey: string;
    /** Determines if the user can edit the code */
    readOnly: boolean;
}

/**
 * Interface for a tool available from the server.
 */
export interface Tool {
    /** The ID used to identify the tool */
    id: string;
    /** The title of the tool (displayed to the user) */
    title: string;
    /** Description of the tool's uses */
    description: string;
    /** The tool's type - Determines some of the actions available to the user */
    toolType: string;
    /** MCIcon used to represent the tool in the {@link ToolSelectionComponent} */
    icon: string;
    /** Categories this tool will affect in Canvas (Pages, Discussions, Quizzes, etc.)*/
    categories: string[];
    /** The category this tool belongs to and will display in through the {@link CategoriesComponent} */
    toolCategory: string;
    /** {@link DiscoverOption}s for this tool, used to generate the options page */
    discoverOptions: DiscoverOption[];
    /** {@link FixOption}s for this tool, used to generate the options on each {@link IssueContainerComponent} */
    fixOptions?: FixOption[];
    /** The message to display at the bottom of each {@link IssueContainerComponent} when the issue has been fixed */
    fixMessage?: string;
    /** The tabs to go into the HTML editor on the issue, if needed */
    editorTabs?: EditorTab[];
}

/**
 * Interface for a category. Tools are categorized based
 * on their purpose. Each category is displayed on the
 * home page.
 */
export interface Category {
    /** The MDIcon used to represent the category in the {@link CategoriesComponent} */
    icon: string;
    /** The title of the category */
    title: string;
    /** The string used by tools to identify the category they belong to */
    toolCategory: string;
}


/** Represents a single issue in an {@link IssueItem}. */
export interface Issue {
    /** The title of the issue */
    title: string;
    /** The status of the issue (untouched, approved, skipped, fixed, failed) */
    status: string;
    /** The HTML string used to display the contents of the issue in its {@link IssueContainerComponent} */
    display: string;
    /** An object containing issue-specific details */
    details: object;
    /** If included, this is the HTML for the issue */
    html: object;
    /** The {@link OptionModel} used to generated any {@link FixOption}s used by the tool */
    optionModel?: OptionModel;
    /** The {@link FormGroup} generated for the issue's {@link FixOption}s */
    formGroup?: FormGroup;
    /** The results of form generated by the above {@link OptionModel} */
    optionValues?: any;
    /** Used to store the current state of the form to restore it on page reload */
    tempValues?: any;
}

/** Represents an item in Canvas, such as a page or quiz. */
export interface IssueItem {
    /** The title of the item in Canvas */
    title: string;
    /** The course ID the item belongs to in Canvas */
    course_id: number;
    /** The content ID of the item in Canvas */
    item_id: number;
    /** The API path to the item in Canvas */
    item_path: string;
    /** The category the item belongs to (pages, quizzes, moduleItems, etc.) */
    category: string;
    /** Link to view the item in Canvas */
    link: string;
    /** {@link Issue}s discovered by a tool within this item */
    issues: Issue[];
}

/** Represents a single course */
export interface Course {
    /** The course's ID in Canvas */
    id: number;
    /** The name of the course in Canvas */
    course_name: string;
    /** The code for the course in Canvas */
    course_code: string;
    /** The platform it belongs to (online, campus, pathway) */
    platform: string;
    /** The current instructor for the course */
    instructor: string;
    /** The {@link IssueItem}s for this course */
    issueItems: IssueItem[];
    /** URL to the course in Canvas */
    url: string;
    /** The sub-account the course is under in Canvas */
    account?: string;
    /** The term the course is set to in Canvas */
    term?: string;
    /** Whether or not the course is a Blueprint course */
    blueprint?: boolean;
    /** Whether the course is currently be processed through a tool */
    processing?: boolean;
    /** If an error is returned by a tool, it is attached to the course here */
    error?: string;
}

/** Standard Error object with a status property */
export interface Error {
    name: string;
    message: string;
    stack?: string;
    status: string;
}
