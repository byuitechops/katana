const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {itemCard} itemCard - The itemCard for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, itemCard, options) {
    // ADD ability to check module items
    if (canvasItem.getHtml() === null) return;
    
    let title = 'Empty hrefs';
    let details = {};
    let display = `
        <div>This item contains at least one < a > tag that has either an empty href="" attribute or no href="" attribute</div>
        <div>Correct this by making it as follows: <strong>href="#"</strong></div>
    `;

    let currentHtml = canvasItem.getHtml();
    let html = {
        currentHtml,
        updatedHtml: currentHtml,
    };
    
    let $ = cheerio.load(canvasItem.getHtml());
    let links = $('a').get();

    /* If there aren't any links in the item then return */
    if (links.length === 0) return;
    let makeIssue = false;
    links.forEach(link => {
        /* Assign the oldUrl name for logging purposes */
        if (!$(link).attr('href') || $(link).attr('href') === "") {
            makeIssue = true;
        }
    });

    if (makeIssue === true) {
        itemCard.newIssue(title, display, details, html);
    }
}

/** ***************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {itemCard} itemCard - The itemCard for the item, including its issues
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
    id: 'empty_hrefs',
    title: 'Empty hrefs',
    description: 'Finds all empty hrefs in a course and allows the user to update and fix them.',
    icon: 'where_to_vote',
    toolCategory: 'html',
    toolType: 'fix',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [],
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
