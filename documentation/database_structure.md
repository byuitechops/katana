# Database Structure

The database consists of three types of items: Items, Issues, and Reports. Each item and its properties are available in detail below. View the [Database Wrapper](./database_wrapper.md) documentation on how these items are retrieved, created, and updated in the database.

|Item               |Description|
|-------------------|-----------|
|[Item](#item)      |Information about an item within a course. Holds all of the discovered issues for the item, along with what tool was used to create the item in the database. Does not contain any data for the actual canvas item aside from its type and its ID.|
|[Issue](#issue)    |An issue related to an item. These are stored on [Items](#item).|
|[Report](#report)  |Solely a reference to where a given report is stored in Google Drive.|

You can view the entire structure of the database in JSON [at the bottom of this page](#fullstructure).

<a name="item"></a>
## Item
|Property       |Type                   |Description|
|---------------|-----------------------|-----------|
|course_id      |*number*               |The ID of the course the issue is for|
|item_type      |*string*               |The Canvas item type of the item containing the issue in Canvas|
|content_id     |*number*               |The ID of the Canvas item|
|exception      |*boolean*              |Indicates an item that is an exception to the rules, and should be ignored by Katana|
|issues         |*[Issue](#issue)*[]    |Array of issues discovered in this item|

<a name="issue"></a>
## Issue
|Property       |Type       |Description|
|---------------|-----------|-----------|
|resolved       |*boolean*  |Whether or not the issue has been resolved|
|created_with   |*string*   |Which tool created the issue, and should be used to fix or verify it|
|resolved_with  |*string*   |Which tool was used to resolve the issue (`manual` indicates it was not solved by a katana tool)|
|created_at     |*date*     |When the issue was created|
|resolved_at    |*date*     |When the issue was resolved|
|created_by     |*string*   |[DEPRECATED] User who created the issue|
|resolved_by    |*string*   |[DEPRECATED] User who resolved the issue|

<a name="report"></a>
## Report
|Property|Type       |Description|
|--------|-----------|-----------|
|link    |*string*   |URL to the location in Google Drive of the report|

<a name="fullstructure"></a>
## Full Database Structure
```js
{
    items: {
        <generated item ID>: {
            course_id: <canvas course ID>,
            item_type: <string>,
            content_id: <number>,
            exception: <bool>,
            issues: {
                <generated issue ID>: {
                    resolved: <bool>,
                    created_with: <manual | tool name>,
                    resolved_with: <string>,
                    created_at: <date>,
                    resolved_at: <date>,
                    created_by: <username>,
                    resolved_by: <username>
                }
            }
        }
    },
    reports: {
        <report ID> {
           link: <link to report in google drive>
        }
    },
}
```
