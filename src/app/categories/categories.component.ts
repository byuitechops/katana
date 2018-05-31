import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    categories = [{
        icon: 'insert_drive_file',
        title: 'Pages',
    }, {
        icon: 'assignment',
        title: 'Assignments'
    }, {
        icon: 'attach_file',
        title: 'Files'
    }, {
        icon: 'folder',
        title: 'Folders'
    }, {
        icon: 'question_answer',
        title: 'Discussions'
    }, {
        icon: 'view_agenda',
        title: 'Modules'
    }, {
        icon: 'view_list',
        title: 'Module Items'
    }, {
        icon: 'gavel',
        title: 'Quizzes'
    }, {
        icon: 'help_outline',
        title: 'Quiz Questions'
    }, {
        icon: 'explore',
        title: 'Syllabus'
    }, {
        icon: 'language',
        title: 'Universal'
    }, {
        icon: 'settings',
        title: 'Course Settings'
    }];

    constructor() {

    }

    ngOnInit() {
    }

}
