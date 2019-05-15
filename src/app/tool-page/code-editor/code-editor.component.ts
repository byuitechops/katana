import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Issue } from '../../interfaces';

/**
 * Integrates the Ace code editor to allow viewing and editing HTML from an issue's canvas item.
 */
@Component({
    selector: 'app-code-editor',
    templateUrl: './code-editor.component.html',
    styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

    /**
     * The tabs to add to the code editor. This may include tabs
     * like "Current HTML" and "Updated HTML" to show the user how
     * the HTML will be changed by the tool.
     */
    @Input('tabs') tabs: any[];

    /**
     * If certain key words should be highlighted by the editor's
     * search functionality, this should be passed as
     * a string. It will be converted into a regex, so
     * a regex string (to be passed into the RegExp constructor)
     * can also be passed in.
     */
    @Input('highlight') highlight: string;

    /**
     * The issue the code editor is displaying code for.
     */
    @Input('issue') issue: Issue;

    /**
     * Element reference to the editor div itself so we can
     * initiate the Ace editor instance.
     */
    @ViewChild('editor') editorEl: ElementRef;

    /**
     * The editor instance. This is set after it has been initialized.
     */
    editor: any;

    /**
     * The currently active tab on the tabs bar of the editor.
     */
    activeTab: any;

    /**
     * Whether or not the editor is in "edit" mode. This just means that
     * it is expanded, currently. Whether or not it can be edited is
     * determined by the tab's "readOnly" property.
     */
    viewExpanded = true;

    /**
     * Stores the tab objects passed in to the "tabs" input. For whatever reason,
     * the passed in tabs don't store as references correctly, so adding
     * the session to them doesn't carry over to the rest of the methods.
     * This helps with those reference issues. This is set during the "ngOnInit"
     * method.
     */
    private _tabs: any[] = [];

    /**
     * Constructor
     */
    constructor() { }

    /**
     * Fired on component load, this sets up the editor, creates the tabs provided
     * by the selected tool, creates the sessions for each tab, beautifies their code,
     * inserts their code, and then sets the settings and options for the editor.
     */
    ngOnInit() {
        // The EditSession class is used to spawn new sessions in the editor
        const EditSession = window['ace'].require('ace/edit_session').EditSession;
        // Allows Ctrl+F Search functionality (keep, even though it says the var is unused)
        const searchBox = window['ace'].require('ace/searchbox');
        // Save a correct reference to the tab objects that is safe to use
        this._tabs = this.tabs;

        // Create and add an editor session to each tab, beautify its code, and insert it
        this._tabs.forEach(tab => {
            const code = window['html_beautify'](tab['htmlString'] || ' '); // Beautifies the code
            tab.session = new EditSession(code);
            tab.session.setMode('ace/mode/html');
            tab.session.setUseWrapMode(true);
            tab.session.setUseWorker(false); // Disables the linter/syntax checker
            tab.session.setTabSize(4); // Sets the tab size to 4 spaces
        });

        // Create the editor, set the options, and set the first session
        this.editor = window['ace'].edit(this.editorEl.nativeElement);
        this.editor.setOption('minLines', 10);
        this.editor.setOption('maxLines', 30);
        this.editor.setTheme('ace/theme/terminal');
        this.editor.setReadOnly(true);
        this.editor.setHighlightActiveLine(true);
        this.setEditorSession(this._tabs[0]);
    }

    /**
     * Sets the editor's session to the selected tab's session
     * @param tab The tab (and it's related info) to set as the
     * editor's current session.
     */
    setEditorSession(tab) {
        if (!tab.session) { return; }
        this.editor.setReadOnly(tab.readOnly);
        this.editor.setSession(tab.session);
        this.activeTab = tab;

        // If the user changes the code in the editor, it will change this issue status to untouched
        this.editor.on('change', () => {
            if (this.issue.status === 'approved') {
                this.issue.status = 'untouched';
            }
            this.issue.html['updatedHtml'] = this.editor.getSession().getValue();
        });

        // This "if" prevents it from searching with an empty search phrase,
        // which finds pretty much every empty character...
        if (this.highlight) {
            // Converts the provided search phrase to a RegExp
            const reg = new RegExp(this.highlight, 'gi');
            // Finds and highlights all matches to the RegExp
            this.editor.findAll(reg, {
                needle: reg,
                wrap: true,
                regExp: true
            });
        }
    }

    /**
     * Toggles the height of the editor window using Ace's "maxLines" editor setting.
     */
    expandView() {
        this.viewExpanded = !this.viewExpanded;
        this.editor.setOption('maxLines', this.viewExpanded ? 30 : 10);
    }

}
