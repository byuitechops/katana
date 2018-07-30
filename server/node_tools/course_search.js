const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    /* TODO: Add a display section if the results return a title that matches */
    let title = '';
    let description = `The search came back with a match for "<strong style="font-weight: 500">${options.searchPhrase}</strong>"`;
    let display = `<div>${description}</div>`;
    let details = { description };
    let html = {
        currentHtml: canvasItem.getHtml(),
        highlight: options.searchPhrase
    };
    let foundTitle = false;

    // search the text content of the item, found within the html
    if (options.inputType === 'HTML') {
        if (canvasItem.getHtml() !== null) {
            html.currentHtml = canvasItem.getHtml();
            let $ = cheerio.load(html.currentHtml);

            // get the item's content from the html
            textContent = $('*').text().toLowerCase();
            htmlContent = $('*').html().toLowerCase();
            
            // If the content doesn't include the search phrase then return
            if (!textContent.includes(options.searchPhrase.toLowerCase()) && 
            !htmlContent.includes(options.searchPhrase.toLowerCase())) return;
            
            // var regex = new RegExp(options.searchPhrase, 'gi');
            // var matches = content.match(regex);
            // display += `
            // <h3>Number of results</h3>
            // <div>
            //     ${matches.length}
            // </div>`;

            title = `${options.inputType} Search Results`;
            details.title = title;
            issueItem.newIssue(title, display, details, html);
        } 
        // if the user is searching by titles
        if (options.titles === 'Yes') {
            foundTitle = includeTitle();
        }
    } else if (options.inputType === 'Regex' && html.currentHtml !== undefined) {
        // search all $.html(), $.text(), and titles?
        let regex = new RegExp(options.searchPhrase, 'ig');
        let found = regex.test(html.currentHtml);
        // console.log(`Regex`, found, options.searchPhrase);

        details.title = title;
        title = `${options.inputType} Matched`;
        issueItem.newIssue(title, display, details);
    }

    /** *************************************************************
     * If the canvasItem type is a module or moduleItem and the user 
     * wants to search titles as well, then search the titles here
     ***************************************************************/
    function includeTitle() {
        var canvasTitle = canvasItem.getTitle();
        var included = canvasTitle.toLowerCase().includes(options.searchPhrase.toLowerCase());
        if (included) {
            display += `
            <h3>Title Matched</h3>
            <div>
                ${canvasTitle}
            </div>`;
            let title = 'Title Search Results';
            details.title = title;
            issueItem.newIssue(title, display, details, html);
            return true;
        }
        return false;
    }
}

module.exports = {
    discover,
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
        choices: ['', 'HTML'],
        required: true
    }, {
        title: 'Search Phrase',
        key: 'searchPhrase',
        description: 'What search phrase would you like to look for? If searching by Regex, backslash your special characters',
        type: 'text',
        choices: [],
        required: true
    }, {
        title: 'Include Titles',
        key: 'titles',
        description: 'Would you like to search the titles for your Search Phrase as well?',
        type: 'dropdown',
        choices: ['', 'Yes', 'No'],
        required: true
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};