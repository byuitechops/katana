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
    let description = 'The search came back with a match on this item';
    let display = `
        <div>${description}</div>
        <h3>Search Phrase</h3>
        <div>
            ${options.searchPhrase}
        </div>
    `;    
    let details = {
        searchPhrase: options.searchPhrase,
        description
    };

    if (options.inputType === 'Text') {
        // search all $.text() in the course, and titles
        // currently searching some discussions, quizzes, and module items more 
        // than once due to multiple occurances of the same item throughout the course
        // console.log(`Title: ${canvasItem.getTitle()}`);
        // console.log(`Type: ${canvasItem.constructor.name}`);
        
        if (canvasItem.constructor.name !== 'Module' && canvasItem.constructor.name !== 'ModuleItem') {
            var $ = cheerio.load(canvasItem.getHtml());
            var text = $('*').text();
            if (canvasItem.getHtml().toLowerCase().includes(options.searchPhrase.toLowerCase())) {
                var regex = new RegExp(options.searchPhrase, 'gi');
                var matches = canvasItem.getHtml().toLowerCase().match(regex)
                console.log(`matches:`, matches)
                console.log(`matches length:`, matches.length, '\n');
            
                title = `${options.inputType} Matched`;
                details.title = title;
                issueItem.newIssue(title, display, details);
            }
        } else {     
            var included = canvasItem.getTitle().toLowerCase().includes(options.searchPhrase.toLowerCase()); 
            if (included) {
                title = `${options.inputType} Matched`;
                details.title = title;
                issueItem.newIssue(title, display, details);
            } 
            return;
        } 
    } else if (options.inputType === 'HTML') {
        // search all $.html() in the course, and maybe titles?
        if (!canvasItem.getHtml() || !canvasItem.getHtml().toLowerCase().includes(options.searchPhrase)) return;
        let $ = cheerio.load(canvasItem.getHtml());
        console.log(`HTML`, options.searchPhrase);
        
        details.title = title;
        title = `${options.inputType} Matched`;
        issueItem.newIssue(title, display, details);
    } else if (options.inputType === 'Regex' && canvasItem.getHtml() !== undefined) {
        // search all $.html(), $.text(), and titles?
        let regex = new RegExp(options.searchPhrase, 'ig');
        let found =  regex.test(canvasItem.getHtml());
        console.log(`Regex`, found, options.searchPhrase);
        
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
    fixedMessage: 'The given search phrase matched',
    icon: 'search',
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
    toolCategory: 'html',
    discoverOptions: [{
        title: 'Input Type',
        key: 'inputType',
        description: 'How would you like to search?',
        type: 'dropdown',
        choices: ['', 'Text', 'HTML', 'Regex'],
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
};