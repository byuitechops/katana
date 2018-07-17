# Node Tools

## Overview
Each node tool will follow the same process and have the same settings/ options available. That process is as follows:

## Settings Object
```
Insert screenshots to complete this section.
```

At the bottom of each tool is an object that determines many attributes of the tool. The various keys and options on the object are described below:
```
module.exports = {
    discover, // the discover functionthat will tell the tool what items toget from Canvas and decide how todisplay them
    fix, // the fix function that willtell the tool what items to fix andhow to do it
    id: 'the_tool_name',
    title: 'The Tool Name',
    description: 'A description of thetool',
    icon: 'A one word icon name fromhttps://material.io/tools/icons/style=baseline',
    toolType: 'fix/search <-- pick onedepending on if you are fixinganything or just searching',
    toolCategory: 'html/itemSettings <--which category the tool will show upunder on the home page',
    fixMessage: 'Describe the result of anitem being fixed here',
    categories: [
        // an array of the Canvas itemtypes to be searched/fixed in thetool
        'assignments',
        'discussions',
        'files',
        'moduleItems',
        'modules',
        'pages',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [{
        // an object array that describesthe available discover/searchoptions that will appear on the'Options' page before the tool isrun
        title: 'The option heading',
        key: 'The object key to referencethe option parameters in the`options` object in the tool',
        description: 'The description ofthe option',
        type: 'text/multiselect/dropdown<-- choose the input type for theoption',
        choices: ['Choice 1', 'Choice 2','Choice 3' <-- not applicable fortype="text"],
        required: true/false
    }],
    fixOptions: [{
        // an object array that describesthe available fix options thatwill appear on each issue cardafter the tool is run
        title: 'The option heading',
        key: 'The object key to referencethe option parameters in the`options` object in the tool',
        description: 'The description ofthe option',
        type: 'text/multiselect/dropdown',
        choices: ['Choice 1', 'Choice 2','Choice 3' <-- not applicable fortype="text"],
        required: true/false
    }],
};
```

## Discover
The purpose of the discover function is to:
1. Determine which items are to be retrieved from Canvas
2. Decide how those items are to be displayed on each issue card in the 'Tool View' on the client side
3. Gather any details that need to be passed to the fix function

The majority of the logic behind the tool should be in this function, and the fix function should simply be to make the change in Canvas.

The discover function in each node tool has a template layout as follows:
```
/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    let title = ``;         // the title of the card on the discovered issue
    let description = '';   // a description of the discover type that will be displayed on the issue card
    let display = ``;       // the html that will be displayed on the issue card
    let details = {};       // an object containing anything needing to be referenced in the fix function 

    if (/*meets condition */true) {

        // Add new issues as needed
        issueItem.newIssue(title, display, details);
    }
}
```

## Fix
The purpose of the fix function is to:
1. Check if the canvasItem should be changed based on the issue status and based on any other conditions
2. Update the status of the issues if changes are made or if otherwise needed
3. Update the item in Canvas

The logic in the fix function should be as minimal as possible and should be abstracted to the discover function if possible.

The fix function in each node tool has a template layout as follows:
```
/*****************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, including its issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fix(canvasItem, issueItem, options) {
    return new Promise(async (resolve, reject) => {
        try {
            if (/*meets condition */true) {
                issueItem.issues.forEach(issue => {
                    if(issue.status === 'approved') {
                        // make the changes here

                        // set the issue status to 'fixed'
                        issue.status = 'fixed';
                    }
                });
                // after making the change, update the item in Canvas
                await canvasItem.update();
                resolve();
            }
        } catch (e) {
            issueItem.issues.forEach(issue => {
                if (issue.status === 'approved') {
                    issue.status = 'failed';
                }
            });
            reject(e);
        }
    });
}
```

## Example (Alt Attributes Tool)
Here is an example of a node tool that replaces Alt attributes on image html tags:
```
const cheerio = require('cheerio');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    if (canvasItem.getHtml() === null) return;
    var $ = cheerio.load(canvasItem.getHtml());
    var images = $('img');

    images.each((i, image) => {
        image = $(image);
        var alt = image.attr('alt');

        // If the option to get ALL alt attributes is selected, move forward, else check alt it is empty/missing
        if (options.altCondition.includes('All image alt') || !alt || alt === '') {

            let title = 'Existing Alt Attribute';
            let description = 'The alt text on this image should be a good description of the image.';

            if (alt === '') {
                title = 'Empty Alt Attribute';
                description = 'The alt text on this image is empty.';
            } else if (!alt) {
                title = 'Missing Alt Attribute';
                description = 'The alt text on this image is missing.';
            }

            let display = `
                <div>${description}</div>
                <h3>Image</h3>
                <div class="navy z-depth-1" style="max-width:100%;border-radius:3px;padding:10px 10px 4px 10px;display:inline-block">
                    <img style="max-width:100%" src="${image.attr('src')}">
                </div>
            `;

            if (alt) {
                display += `
                    <h3>Current Alt Text</h3>
                    <div class="code-block">${alt}</div>
                `;
            }

            let details = {
                image: image.attr('src'),
                title,
                description
            };

            issueItem.newIssue(title, display, details);
        }
    });
}

/*****************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, including its issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fix(canvasItem, issueItem, options) {
    return new Promise(async (resolve, reject) => {
        try {
            if (canvasItem.getHtml()) {
                var $ = cheerio.load(canvasItem.getHtml());

                issueItem.issues.forEach(issue => {
                    if (issue.status === 'approved') {

                        let image = $(`img[src="${issue.details.image}"]`).first();
                        if (image && issue.optionValues.newAltText) {
                            $(image).attr('alt', issue.optionValues.newAltText);
                            issue.status = 'fixed';
                        }

                    }
                });

                canvasItem.setHtml($.html());
                await canvasItem.update();
                resolve();
            }
        } catch (e) {
            issueItem.issues.forEach(issue => {
                if (issue.status === 'approved') {
                    issue.status = 'failed';
                }
            });
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'alt_attributes',
    title: 'Alt Attributes',
    description: 'This tool allows you to edit image alt attributes. It can provide all images in the course, or just images that have empty or missing alt attributes. Courses with a high number of images may cause delays when navigating through issues. You will NOT be able to see any of the images if you are not signed into Canvas.',
    icon: 'text_rotation_none',
    toolType: 'fix',
    toolCategory: 'html',
    fixedMessage: 'The new alt attribute has been inserted',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'altCondition',
        description: 'Do you want to include all image alt attributes or just empty and missing alt attributes?',
        type: 'dropdown',
        choices: ['', 'All image alt attributes', 'Only empty and missing'],
        required: true
    }],
    fixOptions: [{
        title: 'New Alt Text',
        key: 'newAltText',
        description: 'Please enter the new alt text for this image.',
        type: 'text',
        choices: [],
        required: true
    }],
};
```

## Creating a Tool
The process to make a new tool is fairly simple and straightforward:
1. Under `./katana/server/node_tools/` copy the contents of `node_tool_template.js` into a new file under the same directory
2. After you have created your new tool file with the template, get started on the logic of the tool by filling out the `settings object` at the bottom of the file, as discussed earlier in this document
3. Open `./katana/server/node_tools.js` where you will see a list of all the currently available tools in the `toolList` object:
```
const toolList = {
    'course_search': new NodeTool(require('./node_tools/course_search.js')),
    'alt_attributes': new NodeTool(require('./node_tools/alt_attributes.js')),
}
```
4. Add your tool to the list in the format `'tool_id': new NodeTool(require(./node_tools/tool_file.js))`
5. Save everything and run Katana and you should see it!

(This will cover the structure of a basic node tool, how to write one, add it to the server, and deploy it)