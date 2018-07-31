// const cheerio = require('cheerio');

/******************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {

    if (issueItem.category === 'moduleItems') {
        // TODO handle this separately..
    } else {
        let selector = 'a';
        if (issueItem.searchURL != '') selector = `a[href="${issueItem.searchURL}"]`;

        let $ = cheerio.load(canvasItem.getHtml());
        let links = $(selector);

        links.each((i, ele) => {
            let title = 'Matching link found',
                display = 'I found a link',
                details = {}; // TODO what does this do?

            let html = {
                currentHtml: canvasItem.getHtml(),
                highlight: $(ele).attr('href')
            };

            issueItem.newIssue(title, display, details, html);
        });
    }

    // let title = 'Links Found';
    // let display = '<div> FIX LINKS! </div>';
    // let details = {};
    // issueItem.newIssue(title, display, details);
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
        if (issueItem.issues[0].status !== 'approved') return;
        try {
            canvasItem.discussion_type = 'threaded';
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
    id: 'link_editor',
    title: 'Link Editor',
    description: 'Find and replace links in a course. This includes both links found within the course HTML as well as external links found in module items.',
    icon: 'link',
    toolType: 'fix',
    toolCategory: 'html',
    fixMessage: 'Link Updated',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions',
        'moduleItems',
    ],
    discoverOptions: [{
        title: 'Search URL',
        key: 'searchURL',
        description: 'The link URL to search for. If left blank, all links will be found',
        type: 'text',
        choices: [],
        required: false
    }, {
        title: 'New URL',
        key: 'defaultURL',
        description: 'What you would like to set the new URL to (You will have a chance to review changes before they are finalized). If left blank each URL will have to be set individually.',
        type: 'text',
        choices: [],
        required: false,
    }],
    fixOptions: [{
        title: 'New URL',
        key: 'newURL',
        description: 'Please enter the new URL for this link.',
        type: 'text',
        choices: [],
        required: false,
    }],
    editorTabs: [{
        readOnly: true,
        title: 'Current HTML',
        htmlKey: 'currentHtml'
    }]
};
