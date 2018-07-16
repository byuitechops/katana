import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-code-editor',
    templateUrl: './code-editor.component.html',
    styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

    @Input('title') title: string;
    @Input('tabs') tabs: any[];
    @Input('searchPhrase') searchPhrase: any;
    @ViewChild('editor') editorEl: ElementRef;

    editor: any;
    sessions: any = {};
    activeTab: any;
    editMode: boolean = false;
    _tabs: any[] = [];

    constructor() { }

    ngOnInit() {
        let EditSession = window['ace'].require('ace/edit_session').EditSession;
        let searchBox = window['ace'].require('ace/searchbox');

        this._tabs = this.tabs;

        this._tabs.forEach(tab => {
            let code = window['html_beautify'](tab['htmlString'] || ' ');
            tab.session = new EditSession(code);
            tab.session.setMode('ace/mode/html');
            tab.session.setTabSize(4);
        });

        this.editor = window['ace'].edit(this.editorEl.nativeElement);
        this.editor.setOption("minLines", 10);
        this.editor.setOption("maxLines", 10);
        this.editor.setTheme('ace/theme/dracula');
        this.editor.setReadOnly(true);
        this.editor.setHighlightActiveLine(true);
        this.setEditorSession(this._tabs[0]);
    }

    setEditorSession(tab) {
        if (!tab.session) return;
        this.editor.setReadOnly(tab.readOnly);
        tab.session.setUseWrapMode(true);

        this.editor.setSession(tab.session);
        this.activeTab = tab;

        let reg = new RegExp(this.searchPhrase, 'gi');
        this.editor.findAll(reg, {
            needle: this.searchPhrase,
            wrap: true,
            regExp: true
        });
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        this.editor.setOption("maxLines", this.editMode ? 25 : 10);
    }

}
