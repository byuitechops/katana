import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent implements OnInit {
  @Input() // Item Title
  itemTitle: string;
  @Input() // Item Title
  itemID: number;
  @Input() // Item Type
  itemType: string;
  @Input() // Item Link
  itemLink: string;
  @Input() // Item Issues
  itemIssues: object[];

  // @Output() // When a card is clicked
  // cardSelected: EventEmitter<Element> = new EventEmitter<Element>();

  constructor(private issuesService: IssuesService) { }

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

  cardClicked(event) {
    console.log(event);
    this.issuesService.selectedItem = document.querySelector(`${this.itemType}_${this.itemID}`);
    // this.cardSelected.emit(event.target);
  }

}
