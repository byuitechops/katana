# Node Tool Title
### *ID*: child_module_id
### *Description*: This is the description of the tool
### *Tool Type*: <search/fix>
### *Tool Category*: <html/itemSettings>
### *Categories*: <assignments/discussions/files/moduleItems/modules/pages/quizzes/quizQuestions>
### *Required*: <Required/Recommended/Optional> (Ask Zach or Daniel about this)

This tool is built to be used by the Brigham Young University - Idaho Katana Tool. It utilizes the standard `module.exports = {}` signature and uses both Google's Firebase and our own CSV logging functions. You can view extended documentation [Here](https://byuitechops.github.io/katana/docs/additional-documentation/firebase/firebase-wrapper.html).

## Purpose

Describe the reason why this child module exists, and its goals.

## How to Install

```
npm install my-child-module
```

## Run Requirements

List any necessary requirements, such as fields on the `course.info` object. Include if it needs to run first, last, or similar stipulations. 

## Options

If there are options that need to be set before the module runs, include them in a table, like this:

| Option | Values | Description |
|--------|--------|-------------|
|Create Lesson Folders| true/false | Determines if lesson folders should be created inside of "documents" and "media."|
|Remove Course Image| true/false | Determines if the course image will be removed. |

## Outputs

If your module adds anything to `course.info` or anywhere else on the course object, please include a description of each in a table:

| Option | Type | Location |
|--------|--------|-------------|
|Lesson Folders| Array | course.info|

## Process

Describe in steps how the module accomplishes its goals.

1. Does this thing
2. Does that thing
3. Does that other thing

## Log Categories

List the categories used in logging data in your module.

- Discussions Created
- Canvas Files Deleted
- etc.

## Requirements

These are the expectations for the child module. What does it need to do? What is the "customer" wanting from it? 