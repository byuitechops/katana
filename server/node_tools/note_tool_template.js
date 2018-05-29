var canvas = require('canvas-api-wrapper');

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper 
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function check(item, options) {
  // see if the item has the issue this tool is looking for
  // If yes, then...

  item.issues = [] // all issues discovered
  return item;
}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues successfully fixed.
 *****************************************************************/
function fix(item, options) {
  // Fix the item, if there is anything to fix
}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} course - Canvas API wrapper course object
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} issues - All issues discovered or fixed.
 *****************************************************************/
async function discovery(course, options) {
  return new Promise((resolve, reject) => {
    // Set this to the canvas items you need
    let items = await course.modules.get(true);

    // discover list of issues and then resolve the promise with the list

  })
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
