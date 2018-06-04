var canvas = require('canvas-api-wrapper');

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function check(item, options) {

    /* Check the item to see if it is one the tool should run on.
      This might include the item type, or checking the item title */

    /* Now check if the item has any issues. Make sure to save all
      of the issues for a single item. */

    /* On each item with issues, add a property named "issues" with an
    array of objects, one for each issue. Each object should look like this:

    {
      title: 'Less than 6 Word Description',
      status: '', // This should always come back empty
      description: 'Detailed description of the problem. You may have multiple
                    descriptions for different issues that the tool can discover.
                    Consider saving these as an object at the top of the tool,
                    instead of keeping them inline.',
      details: {} /* These are any details needed for the angular side of Katana
                    to know how to display the issue. This should include enough
                    data to reconstruct the issue in the view. * /
    }
*/

    return item;
}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues successfully fixed.
 *****************************************************************/
function fix(issueItem, options) {
    // Fix the item, if there is anything to fix
}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} course - Canvas API wrapper course object
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} issues - All issues discovered or fixed.
 *****************************************************************/
function discovery(course, options) {
    return new Promise(async (resolve, reject) => {
        // Set this to the canvas items you need
        let items = await course.modules.get(true);

        // discover list of issues using check() and then resolve the promise with the list

        // resolve promise with issueItems

    })
}

const details = {
    id: 'tool_id',
    title: 'Tool Title',
    icon: 'settings',
    categories: [
        'Page',
        'Assignment',
        'Discussion',
        'Quiz',
        'QuizQuestion',
        'Module',
        'ModuleItem',
        'File',
        'Folder',
        'CourseSettings',
        'Universal'
    ],
    discoverOptions: [],
    fixOptions: [],
};

module.exports = {
    fix,
    discovery,
    details
};
