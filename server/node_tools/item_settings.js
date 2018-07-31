let fixOptions = [];
/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    console.log(options.selectedSettings);
    // TODO: Find out which option items selected match with the canvas item's available options
    // TODO: Dynamically make the fix options appear(Object Array)
    //


    fixOptions.push({

    });




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
    id: 'item_settings',
    title: 'Item Settings',
    description: 'This tool allows your to edit a Canvas item\'s settings.',
    icon: 'settings',
    toolType: 'fix',
    toolCategory: 'itemSettings',
    fixMessage: 'Describe the result of an item being fixed here',
    categories: [
        'pages',
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'selectedSettings',
        description: 'Select the item properties you would like to modify.',
        type: 'multiselect',
        choices: ['title'],
        required: true
    }],
    fixOptions,
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
