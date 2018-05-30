/* Node Tools | (Key) Tool ID: (Value) requre(pathToTool) */
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
 * Process:
 * 1. Returns a promise
 * 2. Makes sure the tool specified exists, and rejects with an error if it does not
 * 3. Creates "allIssues", which is a flat array of all issueItems discovered in each course
 * 4. Loops through each course provided and sends it through the discovery function of the tool specified
 * 5. Resolves promise with the list of issueItems
 ****************************************************************/
function discoverIssues(toolId, courses, options) {
  return new Promise((resolve, reject) => {
    if (nodeTools[toolId]) {
      let issueItems = courses.reduce(async (acc, course) => {
        let courseProblemItems = await nodeTools[toolId].discovery(course, options);
        let courseIssueItems = courseProblemItems.map(item => {
          return {
            title: item.getTitle(),
            course_id: 54321,
            item_id: item.getId(),
            item_type: item.constructor.name,
            link: item.getUrl(),
            issues: item.issues
          }
        });
        return [...acc, ...courseIssueItems];
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
 * Process:
 * 1. Returns a promise
 * 2. Makes sure the specified tool exists, and rejects with an error if it does not
 * 3. Runs each item through the specified tool and maps results to an array called "fixedItems"
 * 4. Resolves with "fixedItems"
 ****************************************************************/
function fixIssues(toolId, issueItems, options) {
  return new Promise((resolve, reject) => {
    if (nodeTools[toolId]) {
      let fixedItems = issueItems.map(issueItem => await nodeTools[toolId].fix(issueItem, options));
      resolve(fixedItems);
    } else {
      reject(new Error('Invalid Tool ID'));
    }
  });
}
