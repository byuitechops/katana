/* Dependencies */
const canvas = require('canvas-api-wrapper');
const chalk = require('chalk');

/* Node Tools | (Key) Tool ID: (Value) require(pathToTool) */
const toolList = {
    'example_tool_id': require('./node_tools/node_tool_template.js'),
    'test_tool': require('./node_tools/test_tool.js'),
    'deprecated_references': require('./node_tools/deprecated_references.js'),
    'equella_links': require('./node_tools/equella_links.js')
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
 * 3. Creates "allIssueItems", which is a flat array of all issueItems discovered in each course
 * 4. Loops through each course provided and sends it through the discovery function of the tool specified
 * 5. Sets all issue status to 'untouched'
 * 6. Formats all problemItems into IssueItems
 * 7. Resolves promise with the list of issueItems
 ****************************************************************/
function discoverIssues(toolId, courses, options) {
    try {
        console.log(`${chalk.whiteBright('STARTED:')} ${chalk.cyanBright('Discover')} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(toolId)} | ${chalk.whiteBright('COURSES:')} ${chalk.greenBright(courses.length)}`)
        return new Promise((resolve, reject) => {
            if (toolList[toolId]) {
                let allIssueItems = courses.reduce(async (acc, course) => {
                    let canvasCourse = canvas.getCourse(course.id);
                    let problemItems = await toolList[toolId].discover(canvasCourse, options);
                    problemItems.forEach(problemItem => problemItem.issues.forEach(issue => issue.status = 'untouched'));
                    let issueItems = problemItems.map(item => {
                        return {
                            title: item.getTitle(),
                            course_id: course.id,
                            item_id: item.getId(),
                            item_type: item.constructor.name,
                            link: item.getUrl(),
                            issues: item.issues
                        }
                    });
                    return [...acc, ...issueItems];
                }, []);

                console.log(`${chalk.whiteBright('COMPLETE:')} ${chalk.cyanBright('Discover')} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(toolId)} | ${chalk.whiteBright('COURSES:')} ${chalk.greenBright(courses.length)}`)
                resolve(allIssueItems);
            } else {
                reject(new Error('Invalid Tool ID'));
            }
        });
    } catch (e) {
        reject(e);
    }
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
    console.log(`${chalk.whiteBright('STARTED:')} ${chalk.cyanBright('Fix')} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(toolId)} | ${chalk.whiteBright('ISSUE ITEMS:')} ${chalk.greenBright(issueItems.length)}`)
    return new Promise(async (resolve, reject) => {
        if (toolList[toolId]) {
            // let fixedItems = issueItems.map(async issueItem => await tools[toolId].fix(issueItem, options));
            let fixedItems = [];
            for (var x = 0; x < issueItems.length; x++) {
                let fixedItem = await toolList[toolId].fix(issueItems[x], options);
                fixedItems.push(fixedItem);
            }
            console.log(`${chalk.whiteBright('COMPLETE:')} ${chalk.cyanBright('Fix')} | ${chalk.whiteBright('TOOL:')} ${chalk.greenBright(toolId)} | ${chalk.whiteBright('FIXED ITEMS:')} ${chalk.greenBright(fixedItems.length)}`)
            resolve(fixedItems);
        } else {
            reject(new Error('Invalid Tool ID'));
        }
    });
}

module.exports = {
    toolList,
    discoverIssues,
    fixIssues
};