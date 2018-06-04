import { Injectable } from '@angular/core';
import { KatanaService } from './katana.service';
import { Router } from '@angular/router';

export interface DiscoverOption {
  title: string,
  description: string,
  type: string,
  choices: [{
    key: string,
    text: string
  }, {
      key: string,
      text: string
    }, {
      key: string,
      text: string
    }],
  defaults: string[],
  required: boolean
}

export interface Tool {
  id: string,
  title: string,
  icon: string,
  categories: string[],
  discoverOptions: DiscoverOption[],
  fixOptions: object[],
};

@Injectable({
  providedIn: 'root'
})

export class ToolService {

  // The Tool List (set immediately by Katana service)
  toolList: Tool[] = [{
    id: 'page_tool',
    title: 'A Page Tool',
    icon: 'settings',
    categories: ['Page'],
    discoverOptions: [{
      title: 'Option 2',
      description: 'Description Dropdown',
      type: 'dropdown',
      choices: [{
        key: 'choice1',
        text: 'Dropdown One'
      }, {
        key: 'choice2',
        text: 'Dropdown Two'
      }, {
        key: 'choice3',
        text: 'Dropdown Three'
      }],
      defaults: ['choice3'],
      required: true
    }],
    fixOptions: [],
  }, {
    id: 'quiz_tool',
    title: 'A Quiz Tool',
    icon: 'settings',
    categories: ['Quiz'],
    discoverOptions: [],
    fixOptions: [],
  }, {
    id: 'discussion_tool',
    title: 'A Discussions Tool',
    icon: 'settings',
    categories: ['Discussion'],
    discoverOptions: [],
    fixOptions: [],
  }];

  categories = [{
    icon: 'insert_drive_file',
    title: 'Pages',
    type: 'Page'
  }, {
    icon: 'assignment',
    title: 'Assignments',
    type: 'Assignment'
  }, {
    icon: 'attach_file',
    title: 'Files',
    type: 'File'
  }, {
    icon: 'folder',
    title: 'Folders',
    type: 'Folder'
  }, {
    icon: 'question_answer',
    title: 'Discussions',
    type: 'Discussion'
  }, {
    icon: 'view_agenda',
    title: 'Modules',
    type: 'Module'
  }, {
    icon: 'view_list',
    title: 'Module Items',
    type: 'ModuleItem'
  }, {
    icon: 'gavel',
    title: 'Quizzes',
    type: 'Quiz'
  }, {
    icon: 'help_outline',
    title: 'Quiz Questions',
    type: 'QuizQuestion'
  }, {
    icon: 'explore',
    title: 'Syllabus',
    type: 'Syllabus'
  }, {
    icon: 'language',
    title: 'Course Wide',
    type: ''
  }, {
    icon: 'settings',
    title: 'Course Settings',
    type: ''
  }];

  // The currently selected category (i.e. Page)
  selectedCategory: object;
  // The currently selected tool
  selectedTool;

  constructor(private router: Router) {
    let loc = window.location.href;

    // If we're on a tool selection screen, set the selected category
    if (loc.includes('tools?') && loc.includes('category=')) {
      this.selectedCategory = this.categories.find(category => category.type === loc.split('category=')[1].split('&')[0]);
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
