const cheerio = require('cheerio');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    // console.log(canvasItem.constructor.name, options.inputType);
    let title = '';
    let description = `The search came back with a match for "<strong style="font-weight: 500">${options.searchPhrase}</strong>"`;
    let display = `
        <div>${description}</div>
    `;
    let details = {
        searchPhrase: options.searchPhrase,
        description
    };
    let html = {
        currentHtml: canvasItem.getHtml().replace(/((<link rel)|(<script src))=".*amazonaws.*((.css")|(script))>/g, ''),
        searchPhrase: options.searchPhrase
    };

    if (options.inputType === 'Text') {
        // search all $.text() in the course, and titles
        // currently searching some discussions, quizzes, and module items more 
        // than once due to multiple occurances of the same item throughout the course

        if (canvasItem.constructor.name !== 'Module' && canvasItem.constructor.name !== 'ModuleItem') {
            if (html.currentHtml.toLowerCase().includes(options.searchPhrase.toLowerCase())) {
                var regex = new RegExp(options.searchPhrase, 'gi');
                var matches = html.currentHtml.toLowerCase().match(regex);
                display += `
                <h3>Number of results</h3>
                <div>
                    ${matches.length}
                </div>`;
                title = `${options.inputType} Search Results`;
                details.title = title;
                issueItem.newIssue(title, display, details, html);
            }
        } else {
            var included = canvasItem.getTitle().toLowerCase().includes(options.searchPhrase.toLowerCase());
            if (included) {
                title = `${options.inputType} Matched`;
                details.title = title;
                issueItem.newIssue(title, display, details, html);
            }
            return;
        }
    } else if (options.inputType === 'HTML') {
        // search all $.html() in the course, and maybe titles?
        if (!html.currentHtml || !html.currentHtml.toLowerCase().includes(options.searchPhrase)) return;
        // let $ = cheerio.load(canvasItem.getHtml());
        // console.log(`HTML`, options.searchPhrase);

        details.title = title;
        title = `${options.inputType} Matched`;
        issueItem.newIssue(title, display, details);
    } else if (options.inputType === 'Regex' && html.currentHtml !== undefined) {
        // search all $.html(), $.text(), and titles?
        let regex = new RegExp(options.searchPhrase, 'ig');
        let found = regex.test(html.currentHtml);
        // console.log(`Regex`, found, options.searchPhrase);

        details.title = title;
        title = `${options.inputType} Matched`;
        issueItem.newIssue(title, display, details);
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
    });
}

module.exports = {
    discover,
    fix,
    id: 'course_search',
    title: 'Course Search',
    description: 'This tool allows you to search Canvas courses\' HTML and item titles for given words and/or phrases. The tool will only search up-to all text within the html, the html itself, and/or the titles of the various items throughout the course',
    icon: 'search',
    toolType: 'search',
    toolCategory: 'html',
    categories: [
        'assignments',
        'discussions',
        // 'files',
        'moduleItems',
        'modules',
        'pages',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [{
        title: 'Input Type',
        key: 'inputType',
        description: 'How would you like to search?',
        type: 'dropdown',
        choices: ['', 'Text'],
        required: true
    }, {
        title: 'Search Phrase',
        key: 'searchPhrase',
        description: 'What search phrase would you like to look for? If searching by Regex, backslash your special characters',
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