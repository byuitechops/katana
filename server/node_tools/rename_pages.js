var canvas = require('canvas-api-wrapper');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discoverItemIssues(canvasItem, options) {

    let issueItem = {
        title: canvasItem.getTitle(),
        course_id: canvasItem._course,
        item_id: canvasItem.getId(),
        item_type: canvasItem.constructor.name,
        link: canvasItem.getPath(),
        issues: []
    };

    if (canvasItem.getTitle() === options.currentTitle) {
        issueItem.issues.push({
            title: 'Title Change',
            description: 'This item\'s title will be changed to what you specified.',
            details: {
                oldTitle: canvasItem.getTitle(),
                newTitle: options.newTitle
            }
        });
    }

    return issueItem;
}

/*****************************************************************
 * Discovers issues in all items within the provided course.
 * @param {object} course - Course object provided by the client
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {Course[]} course - All issues discovered
 *****************************************************************/
function discoverCourseIssues(course, options) {
    return new Promise(async (resolve, reject) => {
        var canvasCourse = canvas.getCourse(course.id);
        await canvasCourse.pages.get();
        let issueItems = canvasCourse.pages.map(page => discoverItemIssues(page, options));
        course.issueItems = issueItems.filter(issueItem => issueItem.issues.length > 0);
        resolve(course);
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
        let course = canvas.getCourse(issueItem.course_id);
        let page = await course.pages.getOne(issueItem.item_id);
        page.setTitle(options.newTitle);
        await page.update();
        issueItem.issues[0].status = 'fixed';
        resolve();
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
        let promiseActions = course.issueItems.map(page => fixItemIssues(page, options));
        Promise.all(promiseActions)
            .then(() => {
                resolve(course);
            })
    });
}

const details = {
    id: 'rename_pages',
    title: 'Rename Pages',
    icon: 'code',
    categories: [
        'Page',
    ],
    discoverOptions: [{
        title: 'Current Page Title',
        key: 'currentTitle',
        description: 'The title of the page you would like to change.',
        type: 'text',
        choices: [],
        required: true
    }, {
        title: 'New Page Title',
        key: 'newTitle',
        description: 'What you would like to set the page title to.',
        type: 'text',
        choices: [],
        required: true
    }],
    fixOptions: [],
};

module.exports = {
    discoverItemIssues,
    discoverCourseIssues,
    fixItemIssues,
    fixCourseIssues,
    details
};
