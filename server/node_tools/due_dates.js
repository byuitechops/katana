/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    // TODO: Get the due date for the canvasItem
    // TODO: Check if the due date is in-line with the selected semester or if it's missing
    // TODO: Make the issue item information dependent on the outcome of the logic

    // TODO: Existing Due Date
    let title = 'Existing Due Date';
    let description = 'The due date on this item should be the correct date.';
    let display = `<div>${description}</div>`;
    // TODO: Put the current due date underneath the description

    // TODO: Incorrect Due Date(Doesn't match selected semester)
    title = 'Incorrect Due Date';
    description = 'The due date on this item is incorrect.';
    display = `<div>${description}</div>`;
    // TODO: Put the current due date underneath the description

    // TODO: Missing Due Date
    title = 'Missing Due Date';
    description = 'The due date on this item is missing. This could be intentional.';
    display = `<div>${description}</div>`;

    // TODO: Determine what details need to be sent to the Fix function
    let details = {};

    issueItem.newIssue(title, display, details);
}

/** ***************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, including its issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fix(canvasItem, issueItem, options) {
    return new Promise(async (resolve, reject) => {
        try {
            // Loop through each issue and then...
            // Set the issue to fixed...
            // Resolve the promise
            resolve();
        } catch (e) {
            issueItem.issues[0].status = 'untouched';
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'due_dates',
    title: 'Due Dates',
    description: 'This tool allows you to adjust due dates for a specific semester.',
    icon: 'update',
    toolType: 'fix',
    toolCategory: 'html',
    fixMessage: 'The due date has been updated',
    categories: [
        'pages',
        'assignments',
        'quizzes'
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'dueDate',
        description: 'Select the semester you would like to adjust.',
        type: 'dropdown',
        choices: ['Fall 2018', 'Winter 2019', 'Spring 2019', 'Summer 2019', 'Fall 2019'],
        required: true
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
