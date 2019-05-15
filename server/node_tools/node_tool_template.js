/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} itemCard - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, itemCard, options) {
    let title = ``;         // the title of the card on the discovered issue
    let description = '';   // a description of the discover type that will be displayed on the issue card
    let display = ``;       // the html that will be displayed on the issue card
    let details = {};       // an object containing anything needing to be referenced in the fix function 
    let html = {
        currentHtml: canvasItem.getHtml(),   // set the html for the editorTab, if applicable
        highlight: options.highlight // if you are going to highlight something in the editor, assign the string here (i.e. search results)
    };

    if (/*meets condition */true) {

        // Add new issues as needed
        itemCard.newIssue(title, display, details, html);
    }
}

/** ***************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} itemCard - The IssueItem for the item, including its issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fix(canvasItem, itemCard, options) {
    return new Promise(async (resolve, reject) => {
        try {
            // Loop through each issue and then...
            // Set the issue to fixed...
            // Resolve the promise
            resolve();
        } catch (e) {
            itemCard.issues[0].status = 'untouched';
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'rename_pages',
    title: 'Rename Pages',
    description: '',
    icon: 'code',
    toolType: 'fix',
    toolCategory: 'html',
    fixMessage: 'Describe the result of an item being fixed here',
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
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
