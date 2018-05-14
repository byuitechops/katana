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
            sis_course_id: 'Online.Master.M 450',
            // The list of issues for this specific course
            issues: {
                <issue ID>: {
                    // ID for the course in Canvas
                    course_id: <canvas course ID>,
                    // When the issue was created
                    created_at: <date>,
                    // Who ran the tool that discovered it
                    created_by: <username>,
                    // Whether or not the issue has been resolved
                    resolved: <bool>,
                    // Who resolved the issue
                    resolved_by: <username>,
                    // What the issue was resolved with (manual indicates it was done outside of katana)
                    resolved_With: <manual/tool name>,
                    // When it was resolved
                    resolved_at: <date>,
                    // Marking an issue as an exception causes it to be ignored by katana
                    exception: <bool>,
                    // The type of issue determines how it is handled by katana
                    type: <string>,
                    // The details of the Canvas item involved with the issue (i.e. the module item's ID and title)
                    details: <object>
                },
            }
        }
    },
    users: {
        // The username for any particular users that need special types of access (i.e. admins)
        // Otherwise, Canvas's permissions are used
        <username>: {
            // Whether or not the user is an admin in Katana
            admin: <bool>
        }
    },
    reports: {
        <report ID> {
            // When the report was generated
            created_at: <date>,
            // Who generated the report
            created_by: <username>,
            // The logs of what happened
            logs: [logs],
            // The Canvas course ID the report is for
            course_id: <canvas course ID>
        }
    }
}
```