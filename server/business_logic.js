/* Node Tools */
const nodeTools = {
  'example_tool_id': require('./node_tools/note_tool_template.js')
}

/* Course Search */
const courseSearch = require('./course_search/course_search.js');

/*****************************************************************
 * Runs a tool in discovery mode, then returns the issue items discovered.
 * @param {string} toolId - The ID of the tool to be run
 * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {object[]} - Array of issue items discovered by the tool
 ****************************************************************/
function discoverIssues(toolId, courses, options) {
  /* Steps
      1. Returns a promise
      2. Makes sure the tool specified exists, rejects with error if it doesn't
      3. Creates "allIssues", which is a flat array of all issueItems discovered in each course
      4. Loops through each course provided and sends it through the discovery function of the tool specified
      5. Resolves with the list of issueItems
  */
  return new Promise((resolve, reject) => {
    if (nodeTools[toolId]) {
      let issueItems = courses.reduce(async (acc, course) => {
        let issues = await nodeTools[toolId].discovery(course, options);
        return [...acc, ...issues];
      }, []);
      resolve(issueItems);
    } else {
      reject(new Error('Invalid Tool ID'));
    }
  });
}

/*****************************************************************
 * Fixes the provided issue items in Canvas with the specified tool.
 * @param {string} toolId - The ID of the tool to be run
 * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
 * @param {object} options - An object containing the option values specific to the tool
 * @param {object[]} issueItems - Array of issue items to be fixed by the specified tool
 * @returns {object[]} - Array of issue items fixed by the tool
 ****************************************************************/
function fixIssues(toolId, courses, options, issueItems) {

  // TODO - Dynamically select the appropriate tool and run it based on the provided toolId

}
