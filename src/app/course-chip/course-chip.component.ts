import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-course-chip',
  templateUrl: './course-chip.component.html',
  styleUrls: ['./course-chip.component.css']
})
export class CourseChipComponent implements OnInit {
  @Input() // Course Code
  courseCode: string;

  constructor() { }

  ngOnInit() {
  }

}
