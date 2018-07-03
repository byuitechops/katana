/* Dependencies */
const canvas = require('canvas-api-wrapper');
const chalk = require('chalk');
const IssueItem = require('./issue_item.js');
const logActions = require('./logging.js');

/* Course Search */
const courseSearch = require('./course_search/course_search.js');

/* Node Tools | (Key) Tool ID: (Value) require(pathToTool) */
const toolList = {
    'rename_pages': require('./node_tools/rename_pages.js'),
    'alt_attributes': require('./node_tools/alt_attributes.js'),
    'equella_links': require('./node_tools/equella_links.js'),
    'course_search': require('./node_tools/course_search.js')
}

/* Used to log start/stop of different tools */
function logMe(status, type, tool_id, course_name, course_id) {
    console.log(`${chalk.whiteBright(status)}: ${chalk.cyanBright(type)} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(tool_id)} | ${chalk.whiteBright('COURSES:')} ${chalk.greenBright(course_name)} | ${chalk.whiteBright('ID:')} ${chalk.greenBright(course_id)}`);
}

/*****************************************************************
 * Runs a tool in discovery mode, then returns the issue items discovered.
 * @param {string} tool_id - The ID of the tool to be run
 * @param {object[]} course - The course to be run
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {object[]} - Array of issue items discovered by the tool
 ****************************************************************/
function discoverIssues(tool_id, course, options, employeeEmail) {
    return new Promise(async (resolve, reject) => {
        try {
            logMe('START', 'DISCOVER', tool_id, course.course_name, course.id);

            // Build the canvas-api-wrapper course and get all the needed items
            let canvasCourse = canvas.getCourse(course.id);
            let subItems = [];

            for (var i = 0; i < options.categories.length; i++) {
                if (['pages', 'quizzes', 'modules'].includes(options.categories[i])) {
                    await canvasCourse[options.categories[i]].getComplete();
                } else if (['quizQuestions', 'moduleItems'].includes(options.categories[i])) {
                    if (options.categories[i] === 'quizQuestions') {
                        if (!canvasCourse.quizzes) await canvasCourse.quizzes.getComplete();
                        subItems.concat(canvasCourse.quizzes.reduce((acc, quiz) => [...acc, ...quiz.questions], []));
                    } else {
                        if (!canvasCourse.modules) await canvasCourse.modules.getComplete();
                        subItems.concat(canvasCourse.modules.reduce((acc, module) => [...acc, ...module.items]));
                    }
                } else {
                    await canvasCourse[options.categories[i]].get();
                } if (canvasCourse.assignments.length > 0) {
                    // FIXME This isn't working for some reason
                    canvasCourse.assignments = canvasCourse.assignments.filter(assignment => {
                        return !assignment.quiz_id && !assignment.discussion_topic;
                    });
                }
            }

            // Put all of the items into a single array
            let allItems = canvasCourse.getSubs().reduce((acc, sub) => acc.concat(sub), []).concat(subItems);

            // Run each item through the discover function of the selected tool
            course.issueItems = allItems.reduce((acc, item) => {
                let issueItem = new IssueItem(item);
                toolList[tool_id].discover(item, issueItem, options);
                return issueItem.issues.length > 0 ? acc.concat(issueItem) : acc;
            }, []);

            // Log the issue items
            course.issueItems.forEach(issueItem => issueItem.issues.forEach(issue => {
                issue.details.employeeEmail = employeeEmail;
                issue.tool_id = tool_id;
            }));
            logActions.toolLogs = course.issueItems;
            logActions.logTool();

            // Resolve the promise
            logMe('COMPLETE', 'DISCOVER', tool_id, course.course_name, course.id);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

/*****************************************************************
 * Fixes the provided issue items in Canvas with the specified tool.
 * @param {string} tool_id - The ID of the tool to be run
 * @param {Course[]} course - The course who's issueItems are to be fixed
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {Course[]} - Array of courses, which include their updated IssueItems
 ****************************************************************/
function fixIssues(tool_id, course, options, employeeEmail) {
    return new Promise(async (resolve, reject) => {
        try {
            logMe('START', 'FIX', tool_id, course.course_name, course.id);

            let fixPromises = course.issueItems.map(issueItem => {
                return new Promise(async (resolve, reject) => {
                    try {
                        if (issueItem.item_id) {
                            let canvasCourse = canvas.getCourse(course.id);
                            let canvasItem = await canvasCourse[issueItem.category].getOne(issueItem.item_id);
                            await toolList[tool_id].fix(canvasItem, issueItem, options);
                        }
                        resolve();
                    } catch (e) {
                        // Record ERRORS here when logging is implemented
                        // Do not reject here - this will cause the course to stop short if one item has an error
                        // console.error(e);
                        resolve();
                    }
                });
            });

            Promise.all(fixPromises)
                .then(() => {
                    // Log the issue items
                    logActions.toolLogs = course.issueItems;
                    logActions.logTool();
                    
                    // ADD TO COURSE MAINTENANCE LOG HERE
                    logMe('COMPLETE', 'FIX', tool_id, course.course_name, course.id);
                    resolve();
                })
                .catch(console.error);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    toolList,
    discoverIssues,
    fixIssues
};