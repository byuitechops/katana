import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-selection',
  templateUrl: './course-selection.component.html',
  styleUrls: ['./course-selection.component.css']
})
export class CourseSelectionComponent implements OnInit {

  courses = [{
    name: 'Course Support',
    id: 1234,
    code: 'DAA 300',
    instructor: 'Ron Vallejo',
    term: 'All',
    section: 'Reference'
  }, {
    name: 'Technical Operations',
    id: 1347,
    code: 'TECH 100',
    instructor: 'Corey Moore',
    term: 'All',
    section: 'Reference'
  }, {
    name: 'Visual Media and Design',
    id: 2451,
    code: 'COMM 130',
    instructor: 'Seth Childers',
    term: 'Fall',
    section: '3'
  }, {
    name: 'Software Engineering I',
    id: 4321,
    code: 'CS 364',
    instructor: 'William Clements',
    term: 'Spring',
    section: '1, 4'
  }];

  constructor() { }

  ngOnInit() {
  }

}
