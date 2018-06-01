import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-options-view',
    templateUrl: './options-view.component.html',
    styleUrls: ['./options-view.component.css']
})
export class OptionsViewComponent implements OnInit {

    constructor(private toolService: ToolService, private router: Router) { }

    ngOnInit() {
    }

    navToIssues() {
        this.router.navigate([`categories/tools/${this.toolService.selectedTool.id}/issues`]);
    }

}
