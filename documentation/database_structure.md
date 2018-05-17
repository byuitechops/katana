# Database Structure

The database consists of three different collections of items: Courses, Issues, and Reports. Each item and its properties are available in detail below. View the [Database Wrapper](./database_wrapper.md) documentation on how these items are retrieved, created, and updated in the database.

|Item|Description|
|----|-----------|
|[Course](#courseitem)  |Represents a course in canvas. Use solely for identifying a course.|
|[Issue](#issueitem)    |Information about an issue within a course. Does not contain information about the related item in Canvas.|
|[Report](#reportitem)  |Solely a reference to where a given report is stored in Google Drive.|

You can view the entire structure of the database in JSON [at the bottom of this page](#fullstructure).

<a name="courseitem"></a>
## Course Item
|Property|Type|Description|
|--------|----|-----------|
|course_code|*string*|The course's shortname/identifier|
|course_name|*string*|Full title for the course|
|sis_course_id|*string*|Student information system ID|

<a name="issueitem"></a>
## Issue Item
|Property|Type|Description|
|--------|----|-----------|
|course_id|*number*|The ID of the course the issue is for|
|created_at|*date*|When the issue was created|
|resolved|*boolean*|Whether or not the issue has been resolved|
|resolved_with|*string*|Which tool was used to resolve the issue (`manual` indicates it was solved by hand)|
|resolved_at|*date*|When the issue was resolved|
|exception|*boolean*|Indicates an issue that is an exception to the rules, and should be ignored by Katana|
|tool|*string*|Which tool created the issue, and should solve it|
|item_type|*string*|The Canvas item type of the item containing the issue in Canvas|
|content_id|*number*|The ID of the Canvas item|
|created_by|*string*|[DEPRECATED] User who created the issue|
|resolved_by|*string*|[DEPRECATED] User who resolved the issue|


<a name="reportitem"></a>
## Report Item
|Property|Type|Description|
|--------|----|-----------|
|link|*string*|URL to the location in Google Drive of the report|

<a name="reportitem"></a>
## Full Database Structure
```js
{
    courses: {
        // The ID for the course in Canvas
        <canvas course ID>: {
            // The course code for the Canvas course
            course_code: 'M 450',
            // The name of the course in Canvas
            course_name: 'Mythical Analytics',
            // The SIS ID for the course
            sis_course_id: 'Online.Master.M 450'
        }
    },
    issues: {
        // The list of issues for this specific course
        <issue ID>: {
            // ID for the course in Canvas
            course_id: <canvas course ID>,
            // When the issue was created
            created_at: <date>,
            // Whether or not the issue has been resolved
            resolved: <bool>,
            // What the issue was resolved with (manual indicates it was done outside of katana)
            resolved_with: <manual | tool name>,
            // When it was resolved
            resolved_at: <date>,
            // Marking an issue as an exception causes it to be ignored by katana
            exception: <bool>,
            // The tool that discovered the issue, and would be used to fix it
            tool: <string>,
            // The type of the item in Canvas
            item_type: <string>,
            // The ID of the item in Canvas
            content_id: <number>
            // Who ran the tool that discovered it (deprecated for the time being)
            created_by: <username>,
            // Who resolved the issue (deprecated for the time being)
            resolved_by: <username>
        }
    },
    reports: {
        <report ID> {
           link: <link to report in google drive>
        }
    },
}
```
