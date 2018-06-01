import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-tool-selection',
    templateUrl: './tool-selection.component.html',
    styleUrls: ['./tool-selection.component.css']
})
export class ToolSelectionComponent implements OnInit {

    constructor(private toolService: ToolService) { }

    ngOnInit() { }

}
