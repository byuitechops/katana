import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { CourseService } from '../../course.service';
import { IssueReportPipe } from '../../issue-report.pipe'
import { Issue } from 'src/app/interfaces';

@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.css']
})
export class IssueReportComponent implements AfterViewInit {
  /** The number of {@link IssueItem}s currently loaded in the list. Used for lazy loading. */
  issueItemCount = 15;

  /**
   * Constructor
   * @param courseService Provides information and management for selected courses.
   */
  constructor(public courseService: CourseService) {}

  ngAfterViewInit() {
    //   document.querySelector('#details').innerHTML = 'Hello World';
  }

  /**
   * Returns a flat array of all the selected course's issues
   */
  getIssues(): Issue[] {
    return this.courseService.selectedCourse.issueItems.reduce((acc, issueItem) => acc.concat(issueItem.issues), []);
  }

  /**
   * Provides the headings for the issue report
   */
  getReportHeadings() {
    return ["Title", ...Object.keys(this.courseService.selectedCourse.issueItems[0].issues[0].details), "HTML"];
  }

}
