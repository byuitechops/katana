/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
async function discover(canvasItem, issueItem, options) {
    console.log(canvasItem);
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

module.exports = {
    discover,
    id: 'rubric_finder',
    title: 'Rubric Finder',
    description: 'This tool allows you to find/delete unused and duplicated rubrics.',
    icon: 'format_list_numbered',
    toolType: 'search',
    toolCategory: 'itemSettings',
    fixMessage: 'Rubric successfully deleted.',
    categories: ['rubrics'],
    discoverOptions: [{
        title: 'Conditions',
        key: 'rubricSettings',
        description: 'Do you want to search for both duplicate and unused rubrics, or just duplicate or unused rubrics?',
        type: 'dropdown',
        choices: ['', 'Both Duplicate and Unused Rubrics', 'Duplicate Rubrics', 'Unused Rubrics'],
        required: true
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
