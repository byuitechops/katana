import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-code-editor',
    templateUrl: './code-editor.component.html',
    styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

    @Input('title') title: string;
    @Input('tabs') tabs: any[];
    @ViewChild('editor') editorEl: ElementRef;

    editor: any;
    sessions: any = {};
    activeTab: any;
    editMode: boolean = false;

    constructor() { }

    ngOnInit() {
        let EditSession = window['ace'].require('ace/edit_session').EditSession;

        this.tabs.forEach(tab => {
            let code = window['html_beautify'](tab['code']);
            tab.session = new EditSession(code);
            tab.session.setMode('ace/mode/html');
            tab.session.setTabSize(4);
        });

        this.editor = window['ace'].edit(this.editorEl.nativeElement);
        this.editor.setOption("minLines", 10);
        this.editor.setOption("maxLines", 10);
        this.editor.setTheme('ace/theme/tomorrow_night_eighties');
        this.editor.setReadOnly(true);
        this.setEditorSession(this.tabs[0]);
    }

    setEditorSession(tab) {
        this.editor.setReadOnly(tab.readOnly);

        if (tab.readOnly) {
            this.editor.setTheme('ace/theme/tomorrow_night_eighties');
        } else {
            this.editor.setTheme('ace/theme/tomorrow_night_bright');
        }

        this.editor.setSession(tab.session);
        this.activeTab = tab;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        this.editor.setOption("maxLines", this.editMode ? 60 : 10);
    }

}
