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
        id: 'page_tool',
        title: 'A Page Tool',
        icon: 'settings',
        categories: ['Page'],
        discoverOptions: [{}],
        fixOptions: [{}],
    }, {
        id: 'quiz_tool',
        title: 'A Quiz Tool',
        icon: 'settings',
        categories: ['Quiz'],
        discoverOptions: [{}],
        fixOptions: [{}],
    }, {
        id: 'discussion_tool',
        title: 'A Discussions Tool',
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

        // If we're on a tool selection screen, set the selected category
        if (loc.includes('tools?') && loc.includes('category=')) {
            this.selectedCategory = loc.split('category=')[1].split('&')[0];
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
