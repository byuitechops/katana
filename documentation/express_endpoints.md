# Katana Server API

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

## Discover Issues <a name="discoverissues"></a>
```
GET /tools/<tool>?<options>
```
Discovers issues in the selected courses. The `<tool>` field should match the tool name of any available tool. The options provided in the query parameters should match the options needed for the provided tool.

### Options
|name|type|description|
|----|----|-----------|
|Example|Example|Example|

**Returns** `[Issue]`

## Fix Issues <a name="fixissues"></a>
```
PUT /tools/<tool>?<options>
```
### Request Body
The body should be an array of approved issues, in the format they are received from the GET version of this request. The options provided in the query parameters should match the options needed for the provided tool. Keep in mind, these options will be used to implement fixes to the provided issues.

### Options
|name|type|description|
|----|----|-----------|
|Example|Example|Example|

**Returns** `[Issue]`
