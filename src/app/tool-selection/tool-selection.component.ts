import { Component } from '@angular/core';
import { ToolService } from '../tool.service';

@Component({
    selector: 'app-tool-selection',
    templateUrl: './tool-selection.component.html',
    styleUrls: ['./tool-selection.component.css']
})
export class ToolSelectionComponent {

    constructor(public toolService: ToolService) { }

}
