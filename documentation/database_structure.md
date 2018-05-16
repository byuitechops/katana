# Database Structure

The layout of the database is as follows:

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
    reports: {
        <report ID> {
           link: <link to report in google drive>
        }
    },
    issues: {
        // The list of issues for this specific course
        <issue ID>: {
            // ID for the course in Canvas
            course_id: <canvas course ID>,
            // When the issue was created
            created_at: <date>,
            // Who ran the tool that discovered it
            // created_by: <username>, // deprecated for the time being
            // Whether or not the issue has been resolved
            resolved: <bool>,
            // Who resolved the issue
            // resolved_by: <username>, // deprecated for the time being
            // What the issue was resolved with (manual indicates it was done outside of katana)
            resolved_With: <manual/tool name>,
            // When it was resolved
            resolved_at: <date>,
            // Marking an issue as an exception causes it to be ignored by katana
            exception: <bool>,
            // The tool that discovered the issue, and would be used to fix it
            tool: <string>,
            // The type of the item in Canvas
            type: <string>,
            // The ID of the item in Canvas
            content_id: <int>
        },
    }
}
```