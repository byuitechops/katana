import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { CourseService } from '../../course.service';
import { IssueItem } from '../../interfaces';

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
      document.querySelector('#details').innerHTML = 'Hello World';
  }

  /**
   * Provides {@link IssueItem}s to load into the list as {@link IssueCard}s, based on the
   * number allowed (issueItemCount).
   */
  getIssueItems(): IssueItem[] {
      if (this.courseService.selectedCourse.issueItems.length < this.issueItemCount) {
          return this.courseService.selectedCourse.issueItems;
      } else {
          return this.courseService.selectedCourse.issueItems.slice(0, this.issueItemCount);
      }
  }

}
