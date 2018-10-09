const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} itemCard - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, itemCard, options) {
    if (canvasItem.getHtml() === null) return;
    let $ = cheerio.load(canvasItem.getHtml());
    let currentHtml = canvasItem.getHtml();
    let currentText = $('*').text();
    let html = {
        currentHtml,
        updatedHtml: currentHtml,
        highlight: options.searchPhrase
    };

    let title = 'HTML Edit';
    let description = 'Edit the HTML of the page in the \'UPDATED HTML\' tab below and click \'Approve\' button to update the HTML in Canvas.';
    let display = `<div>${description}</div>`;

    // if they entered a search phrase to search by, check if it is in the html or text
    if (options.searchPhrase) {
        // If neither the html nor the text have the search phrase in them, then return
        if (!currentHtml.toLowerCase().includes(options.searchPhrase.toLowerCase()) && 
        !currentText.toLowerCase().includes(options.searchPhrase.toLowerCase())) {
            return;
        }
        // Add the search phrase to the display
        display += `
            <h2>Search Phrase</h2>
            <div>${options.searchPhrase}</div>
        `;
    }

    let details = {};

    itemCard.newIssue(title, display, details, html);
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
            if (canvasItem.getHtml() === null || itemCard.issues[0].status !== 'approved') return;
            if (itemCard.issues[0].html.updatedHtml === itemCard.issues[0].html.currentHtml) return;
            canvasItem.setHtml(itemCard.issues[0].html.updatedHtml);
            itemCard.issues[0].status = 'fixed';
            resolve();
        } catch (e) {
            itemCard.issues[0].status = 'failed';
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'html_general_editor',
    title: 'HTML General Editor',
    description: 'This tool searches a course by HTML tag and/or by a given search phrase. Search results are displayed in an HTML editor. Searching by HTML tag and a search phrase ensures that the search phrase and HTML tag appear within the same Canvas item. It DOES NOT ensure that the given HTML element contains the given search phrase.',
    icon: 'code',
    toolCategory: 'html',
    toolType: 'fix',
    fixMessage: 'The html has been updated on this item',
    categories: [
        'assignments',
        'discussions',
        'pages',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [{
        title: 'Search Phrase',
        key: 'searchPhrase',
        description: 'What search phrase would you like to look for?',
        type: 'text',
        choices: [],
        required: false
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'Updated HTML',
        htmlKey: 'updatedHtml',
        readOnly: false
    }, {
        title: 'Current HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
