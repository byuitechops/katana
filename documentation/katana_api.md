# Server API

## Overview

|Name|Method|URI|Result|
|----|------|---|------|
|[Homepage](#homepage)              |GET|`/`|Serves the user the Homepage|
|[Discover Issues](#discoverissues) |GET|`/tools/<tool>?<options>`|Discovers issues using the provided tool and options|
|[Fix Issues](#fixissues)           |PUT|`/tools/<tool>?<options>`|Fixes issues using the provided tool and options|

Each of the endpoints are described in detail below. Please view the [Database Structure](./database_structure.md) documentation to see the structure of returned items, such as an `Issue`.

<a name="homepage"></a>
## Homepage 
```
GET /
```
Serves the user the homepage.

<a name="discoverissues"></a>
## Discover Issues 
```
POST /tools/<tool>
```
Discovers issues in the selected courses. The `<tool>` field should match the tool name of any available tool. The options provided in the query parameters should match the options needed for the provided tool.

### Request Body

```
{
    // ID of the tool to be run in discovery mode
    tool_id: <string>,
    // The courses the tool should look through
    courses: <object[]>,
    // The options for the specified tool
    options: <object>
}
```

### Options
|name|type|description|
|----|----|-----------|
|Example|Example|Example|

**Returns** `[Issue]`

<a name="fixissues"></a>
## Fix Issues 
```
PUT /tools/<tool>
```
### Request Body

```
{
    // ID of the tool to be run in discovery mode
    tool_id: <string>,
    // The courses the tool should affect
    courses: <object[]>,
    // The options for the specified tool
    options: <object>,
    // The approved issues to be fixed
    issueItems: <object[]>
}
```

### Options
|name|type|description|
|----|----|-----------|
|Example|Example|Example|

**Returns** `[Issue]`
