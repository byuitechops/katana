import { Injectable } from '@angular/core';
import { KatanaService } from './katana.service';
import { Router } from '@angular/router';

export interface Tool {
    id: string,
    title: string,
    icon: string,
    categories: string[],
    discoverOptions: object[],
    fixOptions: object[],
};

@Injectable({
    providedIn: 'root'
})

export class ToolService {

    // The Tool List (set immediately by Katana service)
    toolList: Tool[] = [{
        id: 'test_tool',
        title: 'Test Tool on Pages',
        icon: 'settings',
        categories: ['Page'],
        discoverOptions: [{}],
        fixOptions: [{}],
    }, {
        id: 'test_tool',
        title: 'Test Tool on Quizzes',
        icon: 'settings',
        categories: ['Quiz'],
        discoverOptions: [{}],
        fixOptions: [{}],
    }, {
        id: 'test_tool',
        title: 'Test Tool on Discussions',
        icon: 'settings',
        categories: ['Discussion'],
        discoverOptions: [{}],
        fixOptions: [{}],
    }];

    // The currently selected category (i.e. Page)
    selectedCategory: string;
    // The currently selected tool
    selectedTool;

    constructor(private router: Router) {
        let loc = window.location.href;
        if (loc.includes('?') && loc.includes('category=')) {
            this.selectedCategory = loc.split('category=')[1].split('&')[0];
        } else if (!this.selectedCategory) {
            router.navigate(['/']);
        }
        console.log(this.selectedCategory);
    }
}
