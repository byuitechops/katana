import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';
import { CourseService } from '../course.service';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})

export class BreadcrumbsComponent implements OnInit {

    breadcrumbs = [{
        url: '/',
        title: 'Home'
    }, {
        url: '/',
        title: 'Pages'
    }, {
        url: '/tool-view',
        title: 'Modify Attributes'
    }];

    constructor(private router: Router, public toolService: ToolService, private courseService: CourseService) { }

    ngOnInit() { }

    buildRouterLink(pathPieces) {
        this.router.navigate(pathPieces);
        return false;
    }
}
