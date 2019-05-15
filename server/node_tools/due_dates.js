/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    if (canvasItem.due_at !== undefined) {
        let semesters = {
            fall2018: {
                start: Date('2018-09-17T00:00:00-07:00'),
                end: Date('2018-12-19T23:59:59-07:00')
            },
            winter2019: {
                start: Date('2019-01-07T00:00:00-07:00'),
                end: Date('2019-04-12T23:59:59-07:00')
            },
            spring2019: {
                start: Date('2019-04-22T00:00:00-07:00'),
                end: Date('2019-07-23T23:59:59-07:00')
            },
            summer2019: {
                start: Date('2019-07-29T00:00:00-07:00'),
                end: Date('2019-09-13T23:59:59-07:00')
            },
            fall2019: {
                start: Date('2019-07-29T00:00:00-07:00'),
                end: Date('2019-12-18T23:59:59-07:00')
            },
            winter2020: {
                start: Date('2020-01-08T00:00:00-07:00'),
                end: Date('2020-04-10T23:59:59-07:00')
            }
        };
        // TODO: Get the due date for the canvasItem
        // TODO: Check if the due date is in-line with the selected semester or if it's missing
        // TODO: Make the issue item information dependent on the outcome of the logic

        // TODO: Existing Due Date
        let title = 'Existing Due Date';
        let description = 'The due date on this item should be the correct date.';
        let display = `<div>${description}</div><div>${canvasItem.due_at}</div>`;

        if (canvasItem.due_at === null) {
            title = 'Missing Due Date';
            description = 'The due date on this item is missing. This could be intentional.';
            display = `<div>${description}</div>`;
        } else if (canvasItem.due_at === 'PLACEHOLDER') {
            // TODO: Incorrect Due Date(Doesn't match selected semester)
            title = 'Incorrect Due Date';
            description = 'The due date on this item is incorrect.';
            display = `<div>${description}</div><div>${canvasItem.due_at}</div>`;
        }

        // TODO: Determine what details need to be sent to the Fix function
        let details = {};

        issueItem.newIssue(title, display, details);
    }
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
    title: 'Adjust Due Dates',
    description: 'This tool allows you to adjust due dates for a specific semester.',
    icon: 'update',
    toolType: 'fix',
    toolCategory: 'itemSettings',
    fixMessage: 'The due date has been updated',
    categories: [
        'assignments',
        'quizzes'
    ],
    discoverOptions: [{
        title: 'Semester',
        key: 'dueDate',
        description: 'Select the semester you would like to adjust.',
        type: 'dropdown',
        choices: ['', 'Fall 2018', 'Winter 2019', 'Spring 2019', 'Summer 2019', 'Fall 2019', 'Winter 2020'],
        required: true
    }, {
        title: 'Offset',
        key: 'offset',
        description: 'Number of days to offset all due dates in each course. Positive numbers move the date forward. Negative numbers move the date backward.',
        type: 'text',
        choices: [],
        required: false
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
