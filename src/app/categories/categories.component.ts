import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories = [{
    icon: 'library_books',
    title: 'Pages',
  }, {
    icon: 'assignment',
    title: 'Assignments'
  }, {
    icon: 'file_copy',
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
    icon: 'settings',
    title: 'Course Settings'
  }, {
    icon: 'language',
    title: 'Syllabus'
  }];

  constructor() {

  }

  ngOnInit() {
  }

}
