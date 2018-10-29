import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from './interfaces';

@Pipe({ name: 'issueReport' })
export class IssueReportPipe implements PipeTransform {

  transform(issues: Issue[]): any {
    const modifiedIssues = issues.map(issue => {
    const values = Object.values(issue.details);
    const keyValues = Object.keys(issue.details).map((key, i) => {
      return {
        key,
        value: values[i]
      };
    });
    console.log(keyValues);
    issue.details = keyValues;
    return issue;
  });

  return modifiedIssues;
  }

}
