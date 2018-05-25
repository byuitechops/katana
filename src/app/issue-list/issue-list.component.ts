import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {

  constructor(private issuesService: IssuesService) { }

  ngOnInit() {

  }

  setSelectedItem(elementId) {
    let el = document.getElementById(elementId);
    if (this.issuesService.selectedItem) {
      this.issuesService.selectedItem.classList.remove('selectedItem');
    }
    el.classList.add('selectedItem')
    this.issuesService.selectedItem = el;
    console.log(this.issuesService.selectedItem);
  }
}
