import { Component, Input } from '@angular/core';

/**
 * Displays a single number and title in a pill container.
 */
@Component({
    selector: 'app-stat-badge',
    templateUrl: './stat-badge.component.html',
    styleUrls: ['./stat-badge.component.css']
})
export class StatBadgeComponent {
    /**
     * The title to display on the pill.
     */
    @Input('statTitle') statTitle: string;
    /**
     * The number to display.
     */
    @Input('statCount') statCount: number;
    /**
     * The color of the title.
     */
    @Input('titleColor') titleColor: string = 'white';
    /**
     * The side of the pill the number should be display on.
     */
    @Input('side') side: string = 'right';

    /**
     * Constructor
     */
    constructor() { }
}
