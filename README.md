# Katana

Because a bunch of figurative butter knives weren't good enough for the development team.

## Overview

The intention of Katana is simply to allow safe mass-maintenance of a large number (or small number!) or Canvas courses. To provide an example, the tool will provide functionality to "find and replace" a variety of things. If a link that is commonly used in courses breaks, it could be replaced across any number of courses using Katana. With a variety of various tools, many tedious fixes and audits can be performed through this tool instead.

## Terms

**Categories** - The different parts that make up a course in Canvas (i.e. Pages, Files, Quizzes)

**Item** - A single item within a Canvas course (i.e. a Page or a Quiz)

## What it do

Each fix tool performs a different change to the selected courses. Every change made can be (and should be) reviewed by the user before confirming that they should be implemented. Post-user approval, the change is implemented in each of the selected courses. To give an example:

[comment]: # (TODO Update this with an actual example, once it is more fleshed out)

1. John needs to fix a spelling error that has happened on a page that is copied into every course. The spelling error is only in the current semester's courses.
2. John opens Katana and selects all of the current semester's courses.
3. John selects the "Pages" category, and then selects the "Text Find and Replace" tool.
4. John enters in the incorrectly spelled word, and the correctly spelled version into the provided categories.
5. Each change is previewed to John, and asks for his approval. He gives his approval or denies each change as they are shown to him.
6. Once all have been approved or denied, John submits the fixes. All changes are made within the next couple minutes.

## How it do

Katana uses the **Canvas SDK**, another NodeJS package written by Brigham Young University - Idaho, that allows ease of API manipulation in Canvas. It is centered around "categories," or the different pieces of a course. They are listed below. The **Fix Tools**, or the various tools available in Katana, are built around these categories. Pages will have different tools than Quizzes, and the like. Tools will be available that affect multiple or all categories.

## Categories

[comment]: # (TODO This could have a much better explanation of what universal means)

Here are the available categories:

- Pages
- Files
- Assignments
- Discussion Topics
- Quizzes
- Quiz Questions
- Modules
- Module Items
- Course Settings
- Universal (Tools in this category affect all possible places in the course)

## Fix Tools (Potential)

Here are the potential Fix Tools:

|Tool Name|Categories Affected|Description|
|---------|----------|--------------------|
| Text Find and Replace | Pages | Locates the specific text and replaces it with what the user provides |
| Attribute Editor | Universal | Allows editing of a given attribute on any HTML tags throughout the course (i.e. target attributes, alt text) |
| Broken Links | Universal | Locates all broken links in the course and steps the user through fixing each one |
| HTML Find and Replace | Universal | Locates specific HTML and replaces it with user-given HTML |
| Delete Items | Any | Deletes items in the course based on user input |
| Create Items | Any | Creates new items in the course based on user input |
| Modify Item Titles | Any | Sets titles to what the user provides |
| Modify Settings | Any | Sets item settings to what the user provides |
| Modify Due Dates | Assignments, Discussions, Quizzes | Offsets, removes, udpates, etc. due dates throughout the course |
| Transcripts | Universal | Identifies videos that do not have a transcript and guides the user to provide one |
| Mass Exporter | --- | Exports the selected courses to a provided location on the user's computer |
| Mass Delete | --- | Deletes all of the selected courses |
| Mass Copy | --- | Creates a backup of each of the selected courses |
| Blueprint Association | --- | Associates all of the selected courses with a blueprint course |

## User Interface

The UI for Katana is meant to be as simple as possible. To do so, the tool will be kept to just a handful of pages, relying heavily on dynamically generated content. This will provide the user with a similar experience, no matter what tool they are in within Katana.

### Login Page

The user will be required to sign in when the tool is loaded. They should use their Canvas admin account to log in. Without an admin account or permissions to perform any actions normally through the Canvas UI or API, they will not be able to affect anything with Katana.

### Course Selection Overlay

Each tool relies on the current "selected courses," which are selected by the user on this overlay. To prevent issues with users forgetting what courses they are currently working on, the current selected courses are always available via a sidebar on the left. At the bottom of the bar is a toggle arrow that opens and closes the course selection overlay.

### Categories Page

This page displays each of the different categories as icons. When one is selected, the category icons are removed and any available tools for that category take their place.

### Options Page

When a tool has been selected, an options page appears. This page has inputs for the user to provide the needed information to run the tool. The options will also be available on the actual tool page. They are set here before the tool is loaded to allow users to look at tools to see what they do before running them.

### Tool Page

[comment]: # (TODO Fill this out)

### Components

To help make the code organized and reusable, much of the User Interface will be componentized. Native web components will be used. Here is the current list of components that will be needed:

- Category/Tool Navigation Icon
- Course Selection Sidebar & Overlay
- Chip (Course and Group)
- Groups Sidebar
- Fix List Sidebar
- Fix List Item
- Breadcrumbs
- Search Bar & Results
- Modal (alerts, confirmations, etc.)
- Toast Notifications

## Tool Architecture

There are two types of fix tools: Synchronous and Asynchronous. Each type has a different signature. With Synchronous tools, a "before/after" display are provided. The HTML template for before and after is provided by the tool. With Asynchronous tools, however, there is not a before or after. These are for changes to the course itself, rather than its contents. This includes settings, features, and the like.

### Tool Module Exports

Synchronous tools have the following export:

```javascript
module.exports = {
    title: <string | the title of the tool>,
    buildPreview: <function | returns an HTML string populated with information about the item, used in the before/after display>,
    action: <function | the actual fix functionality, returns the changed item>,
    options: <array of objects | all of the options for the fix tool, used to generate the options HTML>,
    type: <string | sync or async>
}
```

Asynchronous tools have the same export, *except the **buildPreview** function*.

### Function Signatures

Synchronous tools:

```javascript
function action(item <item object from Canvas SDK>, options <array of option objects>) {
    // Make changes to item as needed
    return item;
}
```

Asynchronous tools:

```javascript
function action(course <course object from Canvas SDK>, options <array of option objects>) {
    return new Promise((resolve, reject) => {
        // Make asynchronous changes to course as needed
        resolve(course);
    })
}
```

### Sequence Diagrams

Sequence Charts for Tools:

[Synchronous Fix Tools](https://mermaidjs.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5wYXJ0aWNpcGFudCBDIGFzIENhbnZhcyBTREtcbnBhcnRpY2lwYW50IEsgYXMgS2F0YW5hIFxucGFydGljaXBhbnQgVCBhcyBGaXggVG9vbFxuXG4jIFNESyB0byBLYXRhbmEgZ2V0cyBhbGwgaXRlbXNcbm5vdGUgbGVmdCBvZiBDOiBHZXQgYWxsIGZyb20gQ2FudmFzXG5DIC0-PiBLOiBnZXRBbGwoKVxubG9vcCBlYWNoIEl0ZW1cbm5vdGUgcmlnaHQgb2YgSzogR2V0IGJlZm9yZSBwcmV2aWV3XG5LIC0-PiBUOiBidWlsZFByZXZpZXcoaXRlbSkgXG5UIC0-PiBLOiBQcmV2aWV3IFRlbXBsYXRlIChCZWZvcmUpXG5ub3RlIHJpZ2h0IG9mIEs6IEZpeCB0aGUgaXRlbVxuSyAtPj4gVDogYWN0aW9uKGl0ZW0pXG5UIC0-PiBLOiBDaGFuZ2VkIEl0ZW1cbm5vdGUgcmlnaHQgb2YgSzogR2V0IGFmdGVyIHByZXZpZXdcbksgLT4-IFQ6IGJ1aWxkUHJldmlldyhpdGVtKSBcblQgLT4-IEs6IFByZXZpZXcgVGVtcGxhdGUgKEFmdGVyKVxubm90ZSByaWdodCBvZiBLOiBEaXNwbGF5IFByZXZpZXdzXG5ub3RlIHJpZ2h0IG9mIEs6IFVzZXIgQXBwcm92ZS9EZW55XG5lbmRcbksgLT4-IEM6IEFwcHJvdmVkIEl0ZW1zXG5ub3RlIGxlZnQgb2YgQzogVXBkYXRlIGluIENhbnZhcyIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In19)

[Asynchronous Fix Tools](https://mermaidjs.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5wYXJ0aWNpcGFudCBDIGFzIENhbnZhcyBTREtcbnBhcnRpY2lwYW50IEsgYXMgS2F0YW5hIFxucGFydGljaXBhbnQgVCBhcyBGaXggVG9vbFxucGFydGljaXBhbnQgQzIgYXMgQ2FudmFzIFNES1xuXG4jIFNESyB0byBLYXRhbmEgZ2V0cyBhbGwgaXRlbXNcbm5vdGUgbGVmdCBvZiBDOiBHZXQgQ291cnNlc1xuQyAtPj4gSzogQ291cnNlc1xubm90ZSByaWdodCBvZiBLOiBVc2VyIEFwcHJvdmUgQWxsXG5LIC0-PiBUOiBDb3Vyc2VzXG5UIC0-PiBDMjogQ291cnNlc1xubm90ZSByaWdodCBvZiBDMjogSW1wbGVtZW50IEZpeFxuXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9fQ)

## Miscellaneous Features

- Reports generated after tool runs
- Emailing reports to users
- Action logging (all events are logged)