# Node Tool Template

This template represents the format each of the node tools should follow.

```js

var canvas = require('canvas-api-wrapper');

/**
 * Runs the prescribed fix on each item provided.
 * @param {object} options - INSERT DESCRIPTION 
 * @returns {array} fixedIssues - All issues successfully fixed.
 */
function fix(issues, options) {
   
}

/**
 * Runs the prescribed fix on each item provided.
 * @param {object} options - INSERT DESCRIPTION 
 * @returns {array} issues - All issues discovered.
 */
function discovery(course, options) {
    // Set this to the canvas items you need
    let items = await course.modules.get(true); 

    return items.reduce((acc, item) => {
        let itemIssues = [];

        /* Check if the item has issues here
            IF item has issues, push to itemIssues
            ELSE do nothing
        */

        return [...acc, ...itemIssues];
    }, []);
}

const details = {
    name: 'tool_name',
    itemTypes: [
        'Page',
        'Assignment',
        'Discussion',
        'Quiz',
        'QuizQuestion',
        'Module',
        'ModuleItem'
    ]
};

module.exports = {
    details,
    fix,
    discovery
};
```