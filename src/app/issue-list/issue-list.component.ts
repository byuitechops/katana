import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {

  issues = [{
    itemTitle: 'Potato Instructions',
    itemType: 'Page',
    itemLink: 'https://byui.instructure.com/courses/12872/pages/setup-for-course-instructor?module_item_id=850086',
    itemIssues: [{
      problem: 'Dun a ting',
      details: {},
      status: 'fixed'
    }]
  }, {
    itemTitle: 'Potato Quiz',
    itemType: 'Quiz',
    itemLink: 'https://byui.instructure.com/courses/12872/pages/setup-for-course-instructor?module_item_id=850086',
    itemIssues: [{
      problem: 'Fails to Actually Quiz Students',
      details: {},
      status: 'skipped'
    }, {
      problem: 'No Questions',
      details: {},
      status: 'ready'
    }, {
      problem: 'Just a Flesh Wound',
      details: {},
      status: 'fixed'
    }]
  }];

  constructor() { }

  ngOnInit() {
  }

}
