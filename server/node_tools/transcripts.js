/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    let title = ''; // the title of the card on the discovered issue
    let description = ''; // a description of the discover type that will be displayed on the issue card
    let display = ''; // the html that will be displayed on the issue card
    let details = {}; // an object containing anything needing to be referenced in the fix function 
    let html = {
        currentHtml: canvasItem.getHtml(), // set the html for the editorTab, if applicable
        highlight: options.highlight // if you are going to highlight something in the editor, assign the string here (i.e. search results)
    };

    if ( /*meets condition */ true) {

    // Add new issues as needed
        issueItem.newIssue(title, display, details, html);
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
    id: 'transcripts',
    title: 'Transcripts',
    description: '',
    icon: 'find_in_page',
    toolType: 'fix',
    toolCategory: 'html',
    fixMessage: '',
    categories: [
        'pages',
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'transcriptSearch',
        description: 'Do you want to include all transcripts or only missing transcripts?',
        type: 'dropdown',
        choices: ['', 'All Transcripts', 'Only Missing Transcripts'],
        required: true
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
