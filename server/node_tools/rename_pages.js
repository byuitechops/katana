/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {

    if (canvasItem.getTitle() === options.currentTitle) {
        let title = 'Title Change';
        let display = `
            <div style="margin-bottom: 10px">This item's title will be changed to the new title provided.</div>
            <div class="pad-10">
                <p><div style="display:inline-block;min-width:100px;"><strong>Current Title:</strong></div> ${canvasItem.getTitle()}</p>
                <p><div style="display:inline-block;min-width:100px;"><strong>New Title:</strong></div> ${options.newTitle}</p>
            </div>
        `;

        issueItem.newIssue(title, display);
    }
}

/*****************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, including its issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fix(canvasItem, issueItem, options) {
    return new Promise(async (resolve, reject) => {
        try {
            if (issueItem.issues[0].status === 'approved') {
                canvasItem.setTitle(options.newTitle);
                await canvasItem.update();
                issueItem.issues[0].status = 'fixed';
            }
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
    id: 'rename_pages',
    title: 'Rename Pages',
    description: 'This tool will locate pages that have the exact title as the one provided below. If approved, it will change each discovered page in each course to the new title provided.',
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
