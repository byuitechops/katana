# Katana Server API

## Brief Overview

|Method|URI|Result|
|------|---|------|
|GET|`/`|Serves the user the Homepage|
|GET|`/tools/<tool>?<options>`|Discovers issues using the provided tool and options|
|PUT|`/tools/<tool>?<options>`|Fixes issues using the provided tool and options|

Each of the endpoints are described in detail below. Please view the [Database Structure](./database_structure.md) documentation to see the structure of returned items, such as an `Issue`.

## Homepage
```
GET /
```
Serves the user the homepage.

## Discover Issues
```
GET /tools/<tool>?<options>
```
Discovers issues in the selected courses. The `<tool>` field should match the tool name of any available tool. The options provided in the query parameters should match the options needed for the provided tool.

### Options
|name|type|description|
|----|----|-----------|
|Example|Example|Example|

**Returns** `[Issue]`

## Fix Issues
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
