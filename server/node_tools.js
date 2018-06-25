/* Dependencies */
const canvas = require('canvas-api-wrapper');
const chalk = require('chalk');
const IssueItem = require('./issue_item.js');
const d3 = require('d3-dsv');
const fs = require('fs');
var Logger = require('logger');
var logger = new Logger(`Temp Title`);


/* Course Search */
const courseSearch = require('./course_search/course_search.js');

/* Node Tools | (Key) Tool ID: (Value) require(pathToTool) */
const toolList = {
    'rename_pages': require('./node_tools/rename_pages.js'),
    'equella_links': require('./node_tools/equella_links.js')
}

/* Used to log start/stop of different tools */
function logMe(status, type, tool_id, course_name, course_id) {
    console.log(`${chalk.whiteBright(status)}: ${chalk.cyanBright(type)} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(tool_id)} | ${chalk.whiteBright('COURSES:')} ${chalk.greenBright(course_name)} | ${chalk.whiteBright('ID:')} ${chalk.greenBright(course_id)}`);
    var csvReport = d3.csvFormatRows([[
        status,
        type, 
        tool_id, 
        course_name, 
        course_id
    ]]) + '\n';
    if (!fs.existsSync('C:\\Users\\sethchilders92\\Documents\\katana\\tools_logs.csv')) {
        fs.appendFile(`tools_logs.csv`, `status,type,tool_id,course_name,course_id\n${csvReport}`, (err) => {
            if (err) console.error(err);
        });
    } else {
        fs.appendFile(`tools_logs.csv`, csvReport, (err) => {
            if (err) console.error(err);
        });
    }
}

/*****************************************************************
 * Runs a tool in discovery mode, then returns the issue items discovered.
 * @param {string} tool_id - The ID of the tool to be run
 * @param {object[]} course - The course to be run
 * @param {object} options - An object containing the option values specific to the tool
 * @returns {object[]} - Array of issue items discovered by the tool
 ****************************************************************/
function discoverIssues(tool_id, course, options) {
    return new Promise(async (resolve, reject) => {
        try {
            logMe('START', 'DISCOVER', tool_id, course.course_name, course.id);

            // Build the canvas-api-wrapper course and get all the needed items
            let canvasCourse = canvas.getCourse(course.id);
            for (var i = 0; i < options.categories.length; i++) {
                if (['pages', 'quizzes', 'modules'].includes(options.categories[i])) {
                    await canvasCourse[options.categories[i]].getComplete();
                } else {
                    await canvasCourse[options.categories[i]].get();
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
function fixIssues(tool_id, course, options) {
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
                        reject(e);
                    }
                });
            });

            Promise.all(fixPromises)
                .then(() => {
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