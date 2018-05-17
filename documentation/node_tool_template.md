# Node Tool Template

This template represents the format each of the node tools should follow.

```js

var canvas = require('canvas-api-wrapper');

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
 * @returns {bool}  - All issues successfully fixed.
 */
function verify(item) {
   
}

/**
 * Runs the prescribed fix on each item provided.
 * @param {object} options - INSERT DESCRIPTION 
 * @returns {array} issues - All issues discovered.
 */
function discovery(options) {
    return options.courses.reduce(async (allIssues, courseId) => {
        let course = await canvas.getCourse(courseId);

        // Set this to the canvas items you need
        let items = await course.modules.get(true); 

        let courseIssues = items.reduce((acc, item) => {
            let itemIssues = [];

            /* Check if the item has issues here

                IF item has issues, push to itemIssues

                ELSE do nothing






            */

            return [...acc, ...itemIssues];
        }, []);
        return [...allIssues, ...courseIssues]; // return the ACCUMULATOR + the list of discovered issues in the item
    }, []);
}

module.exports = {
    details,
    fix,
    discovery
};
```