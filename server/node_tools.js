/* Dependencies */
const canvas = require('canvas-api-wrapper');
const chalk = require('chalk');
const logActions = require('./logging.js');
const NodeTool = require('./classes/NodeTool.js');
const firebaseWrapper = require('./firebase_wrapper.js');

/* Node Tools | (Key) Tool ID: (Value) require(pathToTool) */
const toolList = {
    // 'rename_pages': new NodeTool(require('./node_tools/rename_pages.js')),
    // 'course_search': new NodeTool(require('./node_tools/course_search.js')),
    // 'equella_links': new NodeTool(require('./node_tools/equella_links.js')),
    'alt_attributes': new NodeTool(require('./node_tools/alt_attributes.js')),
    'byui_style_classes': new NodeTool(require('./node_tools/byui_style_classes.js')),
    'discussions_threaded': new NodeTool(require('./node_tools/discussions_threaded.js')),
    'course_search': new NodeTool(require('./node_tools/course_search.js')),
    'html_general_editor': new NodeTool(require('./node_tools/html_general_editor.js')),
    // 'broken_images': new NodeTool(require('./node_tools/broken_images.js')),
};

/**
 * Logs to the console the beginning and end of a tool being ran
 * @param {string} status Whether the tool is starting or completing
 * @param {string} type The mode the tool is running in (fix or discover)
 * @param {string} tool_id The ID of the tool being run
 * @param {string} course_name The name of the course being ran through the tool
 * @param {number} course_id The ID of the course in Canvas
 * @param {string} userEmail The Google Email address of the employee running the tool
 */
function logMe(status, type, tool_id, course_name, course_id, userEmail) {
    console.log(`${chalk.whiteBright(status)}: ${chalk.cyanBright(type)} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(tool_id)} | ${chalk.whiteBright('COURSES:')} ${chalk.greenBright(course_name)} | ${chalk.whiteBright('ID:')} ${chalk.greenBright(course_id)} | ${chalk.whiteBright('USER:')} ${userEmail} |  ${chalk.whiteBright('TIME:')} ${new Date()}`);
}

/**
 * Gathers all of the needed items from the course in Canvas
 * @param {Course} course The course object the tool is running on
 * @param {Object} options The options selected by the user
 * @returns {Object[]} All of the items from Canvas needed by the tool
 */
async function getCanvasItems(course, options) {
    // Build the canvas-api-wrapper course and get all the needed items
    let canvasCourse = canvas.getCourse(course.id);
    let items = [];

    for (var i = 0; i < options.categories.length; i++) {
        if (['pages', 'quizzes', 'modules'].includes(options.categories[i])) {
            // If pages, quizzes, or modules, get ALL values for them
            items = items.concat(await canvasCourse[options.categories[i]].getComplete());

        } else if (['quizQuestions', 'moduleItems'].includes(options.categories[i])) {
            // If looking for quiz questions or module items, flatten them here
            if (options.categories[i] === 'quizQuestions') {
                if (canvasCourse.quizzes.length === 0) await canvasCourse.quizzes.getComplete();
                items = items.concat(canvasCourse.quizzes.reduce((acc, quiz) => [...acc, ...quiz.questions], []));
            } else {
                if (canvasCourse.modules.length === 0) await canvasCourse.modules.getComplete();
                items = items.concat(canvasCourse.modules.reduce((acc, module) => {
                    return [...acc, ...module.moduleItems.map(moduleItem => moduleItem)];
                }, []));
            }

        } else {
            // Otherwise, just get the category's items
            items = items.concat(await canvasCourse[options.categories[i]].get());
        }
    }

    // Put all of the items into a single array
    return items;
}

/**
 * Runs a tool in discovery mode, then returns the issue items discovered.
 * @param {string} tool_id - The ID of the tool to be run
 * @param {object[]} course - The course to be run
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {object[]} - Array of issue items discovered by the tool
 */
function discoverIssues(tool_id, course, options, employeeEmail) {
    return new Promise(async (resolve, reject) => {
        try {
            logMe('START', 'DISCOVER', tool_id, course.course_name, course.id, employeeEmail);

            // Put all of the items into a single array
            let allItems = await getCanvasItems(course, options);

            // Add the course name, code, and instructor to the options
            options.courseInfo = {
                course_id: course.id,
                course_code: course.course_code,
                instructorName: course.instructorName
            };

            // Run each item through the discover function of the selected tool
            course.issueItems = allItems.reduce((acc, item) => {
                let issueItem = toolList[tool_id].discover(item, options);
                return issueItem.issues.length > 0 ? acc.concat(issueItem) : acc;
            }, []);

            // Log the issue items
            course.issueItems.forEach(issueItem => issueItem.issues.forEach(issue => {
                issue.details.employeeEmail = employeeEmail;
                issue.tool_id = tool_id;
            }));

            logActions.toolLogs = course.issueItems;
            logActions.logTool();

            // Log all discovered issues to Firestore
            if (!process.argv.includes('-d')) {
                firebaseWrapper.toolLog({course_id: course.id, tool_id, issueItems: course.issueItems.map(issueItem => JSON.stringify(issueItem))});
            }

            // Resolve the promise
            logMe('COMPLETE', 'DISCOVER', tool_id, course.course_name, course.id, employeeEmail);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Fixes the provided issue items in Canvas with the specified tool.
 * @param {string} tool_id - The ID of the tool to be run
 * @param {Course[]} course - The course who's issueItems are to be fixed
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {Course[]} - Array of courses, which include their updated IssueItems
 */
function fixIssues(tool_id, course, options, employeeEmail) {
    return new Promise(async (resolve, reject) => {
        try {
            logMe('START', 'FIX', tool_id, course.course_name, course.id, employeeEmail);

            // Add the course name, code, and instructor to the options
            options.courseInfo = {
                course_id: course.id,
                course_code: course.course_code,
                instructorName: course.instructorName
            };

            let fixPromises = course.issueItems.map(issueItem => toolList[tool_id].fix(issueItem, options));

            Promise.all(fixPromises)
                .then(() => {
                    // Log the issue items
                    logActions.toolLogs = course.issueItems;
                    logActions.logTool();

                    // ADD TO COURSE MAINTENANCE LOG HERE
                    logMe('COMPLETE', 'FIX', tool_id, course.course_name, course.id, employeeEmail);
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