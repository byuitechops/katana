import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent implements OnInit {
  @Input() // Item Title
  itemTitle: string;
  @Input() // Item Type
  itemType: string;
  @Input() // Item Link
  itemLink: string;
  @Input() // Item Issues
  itemIssues: object[];

  constructor() { }

  ngOnInit() {
  }

  getStatusIcon(status) {
    let statusIcons = {
      'fixed': 'check_circle',
      'ready': 'check_circle_outline',
      'skipped': 'remove'
    }
    return statusIcons[status];
  }

}
