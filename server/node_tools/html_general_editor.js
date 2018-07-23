const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    if (canvasItem.getHtml() === null) return;
    let $ = cheerio.load(canvasItem.getHtml());
    let currentHtml = canvasItem.getHtml();
    let currentText = $('*').text();
    
    let title = 'HTML Edit'
    let description = `Edit the HTML of the page in the 'UPDATED HTML' tab below and click 'Approve' button to update the HTML in Canvas.`;
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

    // if they selected tags to search by, then check if the html contains any of them
    if (options.searchTags) {
        let tagsFound = [];
        options.searchTags.forEach(tag => {
            // if the number of tags found is more than zero
            if ($(tag).length !== 0) {
                // if the tag type hasn't been added to tagsFound yet, add it
                if (!tagsFound.includes(tag)) {
                    tagsFound.push(tag);
                }
            }
        });
        // if tagsFound is empty, then the tag wasn't found
        if (tagsFound.length === 0) return;

        // add the 
        display += `
            <h2>Tags Searched For</h2>
            <div>${options.searchTags.join(' ')}</div>
            <h2>Tags Found</h2>
            <div>${tagsFound.join(' ')}</div>
        `;
    }

    let html = {
        currentHtml,
        updatedHtml: currentHtml
    };
// console.log(html)
    let details = {};

    issueItem.newIssue(title, display, details, html);
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
            if (canvasItem.getHtml() === null || issueItem.issues[0].status !== 'approved') return;
            if (issueItem.issues[0].html.updatedHtml === issueItem.issues[0].html.currentHtml) return;
            console.log(`updated: `, issueItem.issues[0].html.updatedHtml);
            canvasItem.setHtml(issueItem.issues[0].html.updatedHtml);
            await canvasItem.update();
            issueItem.issues[0].status = 'fixed';
            resolve();
        } catch (e) {
            issueItem.issues[0].status = 'failed';
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'html_general_editor',
    title: 'HTML General Editor',
    description: `This tool allows for searching for a specific search phrase or item type and edit the html of the returned items.
    This will search both the standalone text of the selected items, and the HTML of the selected items. So if the search phrase were 'byui', 
    and an item contained the HTML '< div class="byui">This tool was built for < span >BYUI</ span ></ div >' then the tool would search the 
    HTML and find 'class="byui"' and it would also search and find it in the text 'This tool was built for BYUI'.`,
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
        title: 'HTML Tags to Search For',
        key: 'searchTags',
        description: `Which HTML tags would you like to search for?`,
        type: 'multiselect',
        choices: [
            'a',
            'b',
            'br', 
            'em', 
            'h1', 
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'i',
            'iframe',
            'img',
            'link',
            'ol',
            'script',
            'span',
            'strong',
            'table',
            'tbody',
            'thead',
            'ul',
        ],
        required: false
    }, {
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
