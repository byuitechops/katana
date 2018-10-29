import { Component, ElementRef, OnInit } from '@angular/core';
import { CourseService } from '../../course.service';
import { IssueReportPipe } from '../../issue-report.pipe';
import { Issue, IssueItem } from 'src/app/interfaces';

@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.css']
})
export class IssueReportComponent implements OnInit {
  myIssues: IssueItem[];
  /**
   * Constructor
   * @param courseService Provides information and management for selected courses.
   */
  constructor(public courseService: CourseService) {
    this.myIssues = this.courseService.selectedCourse.issueItems;
    console.log(`myIssues: ${this.myIssues}`);
  }

  ngOnInit() {
    //   document.querySelector('#details').innerHTML = 'Hello World';
  }

  /**
   * Returns a flat array of all the selected course's issues
   */
  getIssues(): Issue[] {
    // console.log(this.courseService.selectedCourse.issueItems);
    return this.courseService.selectedCourse.issueItems.reduce((acc, issueItem) => acc.concat(issueItem.issues), []);
  }

  /**
   * Provides the headings for the issue report
   */
  getReportHeadings() {
    if (this.courseService.selectedCourse.issueItems.length > 0) {
      console.log(this.courseService.selectedCourse.issueItems);
      const foundIssue = this.getIssues().find(issue => {
        console.log(issue);
        return issue.details !== undefined && Object.keys(issue.details).length > 0;
      });
      return ['Title', ...Object.keys(foundIssue.details), 'HTML'];
    }
  }

  getCourseNames() {
    const courseCodes = this.courseService.courses.map(course => course.course_code);
    return courseCodes.join(' and ');
  }
}
