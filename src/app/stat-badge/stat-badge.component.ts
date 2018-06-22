import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stat-badge',
    templateUrl: './stat-badge.component.html',
    styleUrls: ['./stat-badge.component.css']
})
export class StatBadgeComponent {
    @Input('statTitle') statTitle: string;
    @Input('statCount') statCount: number;
    @Input('side') side: string = 'right';

    constructor() {
        console.log(this.side);
    }

}
