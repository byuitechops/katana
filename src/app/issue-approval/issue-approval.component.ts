import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-issue-approval',
  templateUrl: './issue-approval.component.html',
  styleUrls: ['./issue-approval.component.css']
})
export class IssueApprovalComponent implements OnInit {

  constructor(private issuesService: IssuesService) {


  }

  ngOnInit() {
  }

  shiftSelectedItem(direction) {
    if (this.issuesService.selectedItem) {
      console.log(this.issuesService.selectedCard.parentElement.previousElementSibling);
      console.log(this.issuesService.selectedCard.parentElement.nextElementSibling);
      if (direction === 'up' && this.issuesService.selectedCard.parentElement.previousElementSibling) {
        this.issuesService.setSelectedItem(this.issuesService.selectedCard.parentElement.previousElementSibling.firstChild.id);
      } else if (direction === 'down' && this.issuesService.selectedCard.parentElement.nextElementSibling) {
        this.issuesService.setSelectedItem(this.issuesService.selectedCard.parentElement.nextElementSibling.firstChild.id);
      }
    } else {
      // Get first el and select it
    }
  }

}
