/* Dependencies */
const canvas = require('canvas-api-wrapper');
const chalk = require('chalk');

/* Node Tools | (Key) Tool ID: (Value) require(pathToTool) */
const toolList = {
    // 'example_tool_id': require('./node_tools/node_tool_template.js'),
    // 'test_tool': require('./node_tools/test_tool.js'),
    // 'deprecated_references': require('./node_tools/deprecated_references.js'),
    // 'equella_links': require('./node_tools/equella_links.js'),
    'rename_pages': require('./node_tools/rename_pages.js')
}

/* Course Search */
const courseSearch = require('./course_search/course_search.js');

function logMe(status, type, toolId, count) {
    console.log(`${chalk.whiteBright(status)}: ${chalk.cyanBright(type)} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(toolId)} | ${chalk.whiteBright('COURSES:')} ${chalk.greenBright(count)}`)
}

/*****************************************************************
 * Runs a tool in discovery mode, then returns the issue items discovered.
 * @param {string} toolId - The ID of the tool to be run
 * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {object[]} - Array of issue items discovered by the tool
 * Process:
 * 1. Returns a promise
 * 2. Makes sure the tool specified exists, and rejects with an error if it does not
 * 3. Creates "allIssueItems", which is a flat array of all issueItems discovered in each course
 * 4. Loops through each course provided and sends it through the discovery function of the tool specified
 * 5. Sets all issue status to 'untouched'
 * 6. Formats all problemItems into IssueItems
 * 7. Resolves promise with the list of issueItems
 ****************************************************************/
function discoverIssues(toolId, courses, options) {
    function constructIssues(course) {
        return new Promise(async (resolve, reject) => {
            await toolList[toolId].discoverCourseIssues(course, options);
            course.issueItems.forEach(issueItem => issueItem.issues.forEach(issue => issue.status = 'untouched'));
            resolve();
        });
    }
    try {
        logMe('STARTED', 'Discover', toolId, courses.length);
        return new Promise(async (resolve, reject) => {
            if (toolList[toolId]) {
                let promiseActions = courses.map(course => constructIssues(course));
                Promise.all(promiseActions)
                    .then(() => {
                        logMe('COMPLETE', 'Discover', toolId, courses.length);
                        resolve(courses);
                    });
            } else {
                reject(new Error('Invalid Tool ID'));
            }
        });
    } catch (e) {
        console.error(e);
    }
}

/*****************************************************************
 * Fixes the provided issue items in Canvas with the specified tool.
 * @param {string} toolId - The ID of the tool to be run
 * @param {object[]} courses - Array of courses to be run, with their IssueItems attached (typically the currently selected courses)
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {object[]} - Array of issue items fixed by the tool
 * Process:
 * 1. Returns a promise
 * 2. Makes sure the specified tool exists, and rejects with an error if it does not
 * 3. Runs each item through the specified tool and maps results to an array called "fixedItems"
 * 4. Resolves with "fixedItems"
 ****************************************************************/
function fixIssues(toolId, courses, options) {
    function fixAllIssues(course) {
        return new Promise(async (resolve, reject) => {
            let fixedIssueItems = await toolList[toolId].fixCourseIssues(course, options);
            course.issueItems = fixedIssueItems;
            resolve();
        });
    }
    try {
        logMe('STARTED', 'Fix', toolId, courses.length);
        return new Promise(async (resolve, reject) => {
            if (toolList[toolId]) {
                let promiseActions = courses.map(course => fixAllIssues(course));
                Promise.all(promiseActions)
                    .then(() => {
                        logMe('COMPLETE', 'Fix', toolId, courses.length);
                        resolve(courses);
                    });
            } else {
                reject(new Error('Invalid Tool ID'));
            }
        });
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    toolList,
    discoverIssues,
    fixIssues
};