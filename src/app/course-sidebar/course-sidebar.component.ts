import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-sidebar',
  templateUrl: './course-sidebar.component.html',
  styleUrls: ['./course-sidebar.component.css']
})
export class CourseSidebarComponent implements OnInit {

  courses = [{
    courseCode: 'B 383'
  }, {
    courseCode: 'CS 364'
  }, {
    courseCode: 'COMM 130'
  }];
  
  constructor() { }

  ngOnInit() {
  }

}
