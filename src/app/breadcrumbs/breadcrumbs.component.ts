import { Component, OnInit } from '@angular/core';
import { appRoutes } from '../app.module';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})

export class BreadcrumbsComponent implements OnInit {

    breadcrumbs = [{
        url: '/',
        title: 'Home'
    }];

    constructor() { }

    ngOnInit() {
    }
}
