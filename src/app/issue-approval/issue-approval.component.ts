import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../issues.service';

@Component({
    selector: 'app-issue-approval',
    templateUrl: './issue-approval.component.html',
    styleUrls: ['./issue-approval.component.css']
})
export class IssueApprovalComponent implements OnInit {

    constructor(private issuesService: IssuesService) { }

    ngOnInit() {
        // Sets the first card/item as the selected item when the page loads
        let loop = setInterval(() => {
            let firstCard = document.querySelector('.issueCard');
            console.log(firstCard);
            if (firstCard) {
                this.issuesService.setSelectedItem(firstCard.id);
                clearInterval(loop);
            }
        }, 100);
    }
    
    /*****************************************************************
     * Switches the selected card and item to the one below or above the currently selected card
     * @param {string} direction - Either "up" or "down", indicates the direction it should shift
     ****************************************************************/
    shiftSelectedItem(direction) {
        if (this.issuesService.selectedItem) {
            if (direction === 'up' && this.issuesService.selectedCard.parentElement.previousElementSibling) {
                this.issuesService.setSelectedItem(this.issuesService.selectedCard.parentElement.previousElementSibling.firstElementChild.id);
            } else if (direction === 'down' && this.issuesService.selectedCard.parentElement.nextElementSibling) {
                this.issuesService.setSelectedItem(this.issuesService.selectedCard.parentElement.nextElementSibling.firstElementChild.id);
            }
        } else {
            let firstCard = document.querySelector('.issueCard');
            if (firstCard) {
                this.issuesService.setSelectedItem(firstCard.id);
            }
        }
    }
}
