/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The issueItem issues will be appended to
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {

    if (canvasItem.getTitle() === options.currentTitle) {
        let title = 'Title Change';
        let details = `
            <div style="margin-bottom: 10px">This item's title will be changed to the new title provided.</div>
            <div class="pad-10">
                <p><div style="display:inline-block;min-width:100px;"><strong>Current Title:</strong></div> ${canvasItem.getTitle()}</p>
                <p><div style="display:inline-block;min-width:100px;"><strong>New Title:</strong></div> ${options.newTitle}</p>
            </div>
        `;

        issueItem.newIssue(title, details);
    }

    return issueItem;
}

/*****************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fix(canvasItem, issueItem, options) {
    return new Promise(async (resolve, reject) => {
        canvasItem.setTitle(options.newTitle);
        issueItem.issues[0].status = 'fixed';
        await canvasItem.update();
        resolve();
    });
}

module.exports = {
    discover,
    fix,
    id: 'rename_pages',
    title: 'Rename Pages',
    icon: 'code',
    categories: [
        'pages',
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
