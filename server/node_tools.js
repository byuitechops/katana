/* Dependencies */
const canvas = require('canvas-api-wrapper');
const chalk = require('chalk');
const IssueItem = require('./issue_item.js');

/* Course Search */
const courseSearch = require('./course_search/course_search.js');

/* Node Tools | (Key) Tool ID: (Value) require(pathToTool) */
const toolList = {
    'rename_pages': require('./node_tools/rename_pages.js'),
    'equella_links': require('./node_tools/equella_links.js')
}

/* Used to log start/stop of different tools */
function logMe(status, type, tool_id, count) {
    console.log(`${chalk.whiteBright(status)}: ${chalk.cyanBright(type)} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(tool_id)} | ${chalk.whiteBright('COURSES:')} ${chalk.greenBright(count)}`)
}

/*****************************************************************
 * Runs a tool in discovery mode, then returns the issue items discovered.
 * @param {string} tool_id - The ID of the tool to be run
 * @param {object[]} courses - Array of courses to be run (typically the currently selected courses)
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {object[]} - Array of issue items discovered by the tool
 ****************************************************************/
function discoverIssues(tool_id, courses, options) {
    function courseDiscover(course) {
        return new Promise(async (resolve, reject) => {
            try {
                logMe('START', 'DISCOVER', tool_id, course.course_name);

                // Build the canvas-api-wrapper and get all the needed items
                let canvasCourse = canvas.getCourse(course.id);
                for (var i = 0; i < toolList[tool_id].categories.length; i++) {
                    if (['pages', 'quizzes', 'modules'].includes(toolList[tool_id].categories[i])) {
                        await canvasCourse[toolList[tool_id].categories[i]].getComplete();
                    } else {
                        await canvasCourse[toolList[tool_id].categories[i]].get();
                    }
                }

                // Put all of the items into a single array
                let allItems = canvasCourse.getSubs().reduce((acc, sub) => acc.concat(sub));

                // Run each item through the discover function of the selected tool
                course.issueItems = allItems.reduce((acc, item) => {
                    let issueItem = new IssueItem(item);
                    toolList[tool_id].discover(item, issueItem, options);
                    return issueItem.issues.length > 0 ? acc.concat(issueItem) : acc;
                }, []);

                // Resolve the promise
                resolve();
                logMe('COMPLETE', 'DISCOVER', tool_id, course.course_name);
            } catch (e) {
                reject(e);
            }
        });
    }

    return new Promise((resolve, reject) => {
        let promises = courses.map(course => courseDiscover(course));
        Promise.all(promises)
            .then(resolve)
            .catch(reject);
    });
}

/*****************************************************************
 * Fixes the provided issue items in Canvas with the specified tool.
 * @param {string} tool_id - The ID of the tool to be run
 * @param {Course[]} courses - Array of courses to be run, with their IssueItems attached (typically the currently selected courses)
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {Course[]} - Array of courses, which include their updated IssueItems
 ****************************************************************/
function fixIssues(tool_id, courses, options) {
    function courseFix(course) {
        return new Promise(async (resolve, reject) => {
            try {
                logMe('START', 'FIX', tool_id, course.course_name);

                let fixPromises = course.issueItems.map(issueItem => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            let canvasCourse = canvas.getCourse(course.id);
                            let canvasItem = await canvasCourse[issueItem.category].getOne(issueItem.item_id);
                            await toolList[tool_id].fix(canvasItem, issueItem, options);
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    });
                });

                Promise.all(fixPromises)
                    .then(() => {
                        logMe('COMPLETE', 'FIX', tool_id, course.course_name);
                        resolve();
                    })
                    .catch(console.error);
            } catch (e) {
                reject(e);
            }
        });
    }

    return new Promise((resolve, reject) => {
        let promises = courses.map(course => courseFix(course));
        Promise.all(promises)
            .then(resolve)
            .catch(reject);
    });
}

module.exports = {
    toolList,
    discoverIssues,
    fixIssues
};