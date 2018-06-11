var canvas = require('canvas-api-wrapper');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {Promise} - A promise that resolves with an IssueItem
 *****************************************************************/
function discoverItemIssues(canvasItem, options) {



}

/*****************************************************************
 * Discovers issues in all items within the provided course.
 * @param {object} course - Course object provided by the client
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {Promise} - A Promise that resolve with an array of Course objects
 *****************************************************************/
function discoverCourseIssues(course, options) {
    return new Promise(async (resolve, reject) => {



    });
}

/*****************************************************************
 * Fixes issues in the item provided.
 * @param {IssueItem} issueItem - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fixItemIssues(issueItem, options) {
    return new Promise(async (resolve, reject) => {



    });
}

/*****************************************************************
 * Fixes issues in all items within the provided course.
 * @param {object} course - Course object provided by the client
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {Course[]} course - All issues discovered
 *****************************************************************/
function fixCourseIssues(course, options) {
    return new Promise(async (resolve, reject) => {



    });
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
