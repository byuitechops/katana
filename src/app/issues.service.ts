import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IssuesService {

    issueItems = [{
        itemTitle: 'Potato Instructions',
        itemType: 'Page',
        itemID: 12345,
        itemLink: 'https://byui.instructure.com/courses/12872/pages/setup-for-course-instructor?module_item_id=850086',
        itemIssues: [{
            problem: 'Thing Done B0rkEd',
            details: {},
            status: 'fixed'
        }, {
            problem: 'This is Broken',
            details: {},
            status: ''
        }]
    }, {
        itemTitle: 'Potato Quiz',
        itemType: 'Quiz',
        itemID: 12346,
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
    }, {
        itemTitle: 'Potato Quiz',
        itemType: 'Quiz',
        itemID: 123465,
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
    }, {
        itemTitle: 'Potato Quiz',
        itemType: 'Quiz',
        itemID: 123464,
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
    }, {
        itemTitle: 'Potato Quiz',
        itemType: 'Quiz',
        itemID: 123463,
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
    }, {
        itemTitle: 'Potato Quiz',
        itemType: 'Quiz',
        itemID: 123462,
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
    }, {
        itemTitle: 'Potato Quiz',
        itemType: 'Quiz',
        itemID: 123461,
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

    selectedItem: object;
    selectedCard: Element;

    constructor() { }

    //   TODO add documentation
    setSelectedItem(elementId) {
        let el = document.getElementById(elementId);
        if (this.selectedItem) {
            let currentEl = document.querySelector('.selectedItem');
            if (currentEl) currentEl.classList.remove('selectedItem');
        }
        el.classList.add('selectedItem');
        this.selectedItem = this.issueItems.find(issueItem => {
            return `${issueItem.itemType}_${issueItem.itemID}` === el.id;
        });
        this.selectedCard = el;
    }
}
