const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    /** *************************************************************
     * If the user wants to search titles as well, then search the titles here
     ***************************************************************/
    function checkTitle() {
        // set the input to lowercase and uniform the whitespaces for comparison
        let included = searchContent.title.includes(options.searchInput.toLowerCase());
        // if searching by regex then check differently
        if (options.searchType === 'Regex') {
            let input = options.searchInput.split(' ');
            let regex = new RegExp(input[0], input[1]);
            included = regex.test(canvasItem.getTitle());
            description = `The search came back with a match for "<strong style="font-weight: 500">${regex}</strong>"`;
        }

        if (included) {
            let display = `
            <div>${description}</div>
            <h3>Title Matched</h3>
            <div>
            ${canvasItem.getTitle()}
            </div>`;
            let title = 'Title Search Results';
            let details = {
                description,
                title
            }
            issueItem.newIssue(title, display, details);
        }
    }
    
    /** *************************************************************
     * If the canvas item is a module item, search it's external url for the search input
     ***************************************************************/
    function searchModuleItem() {
        let included = canvasItem.external_url.toLowerCase().includes(options.searchInput.toLowerCase());
        // if searching by regex then check differently
        if (options.searchType === 'Regex') {
            let input = options.searchInput.split(' ');
            let regex = new RegExp(input[0], input[1]);
            included = regex.test(canvasItem.external_url);
            description = `The search came back with a match for "<strong style="font-weight: 500">${regex}</strong>"`;
        }
       
        if (included) {
            let display = `
            <div>${description}</div>
            <h3>Module Item External URL Matched</h3>
            <div>
            ${canvasItem.external_url}
            </div>`;
            let title = 'Module Item External URL Search Results';
            let details = {
                description,
                title
            }
            issueItem.newIssue(title, display, details);
        }
    }
    
    /** *************************************************************
     * Get the title, html, and the text if applicable, make everything lowercase
     * and replace all whitespace with a single space for comparison
     ***************************************************************/
    function getSearchContent() {
        let search = {};
        // get the title if necessary
        search.title = canvasItem.getTitle().toLowerCase().replace(/\s*/, ' ');
        // get the html and the text if necessary
        if (html.currentHtml !== null && html.currentHtml !== undefined) {
            let $ = cheerio.load(canvasItem.getHtml() || '');
            if (options.searchThrough === 'HTML and Text') {
                search.text = $('*').text().toLowerCase().replace(/\s*/, ' ');
                search.html = $('*').html().toLowerCase().replace(/\s*/, ' ');
            } else if (options.searchThrough === 'HTML') {
                search.html = $('*').html().toLowerCase().replace(/\s*/, ' ');
            } else if (options.searchThrough === 'Text') {
                // if searching by text only, then put the text in the html editor for the user to see
                html.currentHtml = $('*').text();
                search.text = $('*').text().toLowerCase().replace(/\s*/, ' ');
            }
        }
        return search;
    }

    /** *************************************************************
     * Return false if it the html/ text doesn't include the searchInput 
     ***************************************************************/
    function searchText() {
        if (options.searchThrough === 'HTML') {
            if (!searchContent.html.includes(options.searchInput.toLowerCase())) return false;
        } else if (options.searchThrough === 'Text') {
            if (!searchContent.text.includes(options.searchInput.toLowerCase())) return false;
        } else if (options.searchThrough === 'HTML and Text') {
            if (!searchContent.html.includes(options.searchInput.toLowerCase()) && 
                !searchContent.text.includes(options.searchInput.toLowerCase())) return false;
        }
        return true;
    }

    /** *************************************************************
     * Return false if it the html/ text doesn't match the Regex from the searchInput
     ***************************************************************/
    function searchRegex() {
        let input = options.searchInput.split(' ');
        let regex = new RegExp(input[0], input[1]);
        let found = regex.test(canvasItem.getHtml());
        return found ? regex : false;
    }

    /** *************************************************************
     * Return false if it the html/ text doesn't match the CSS Selector from the searchInput
     ***************************************************************/
    function searchCss() {
        let $ = cheerio.load(canvasItem.getHtml() || '');
        let input = options.searchInput;
        let found = $(input).get();
        if (found.length > 0) {
            return true;
        }
        return false;
    }

    /** *************************************************************
     * Here is where discover really starts
     ***************************************************************/
    let title = `${options.searchThrough} - ${options.searchType} Search Results`;
    let description = `The search came back with a match for "<strong style="font-weight: 500">${options.searchInput}</strong>"`;
    let html = {
        currentHtml: canvasItem.getHtml(),
        highlight: options.searchInput
    };
    
    // get the html, text, and title for the canvasItem
    let searchContent = getSearchContent();

    // check the module item's external url for the searchInput
    if (canvasItem.constructor.name === 'ModuleItem' && canvasItem.external_url) {
        searchModuleItem();
    }
    // if the user is searching by titles
    if (options.searchTitle === 'Yes' && options.searchType !== 'CSS Selector') {
        checkTitle();
    }
    // Search the text content of the item, found within the html.
    // If the content doesn't include the search phrase then return
    let includes = false;
    if (html.currentHtml) {
        if (options.searchType === 'Text') {
            includes = searchText();
        } else if (options.searchType === 'CSS Selector') {
            includes = searchCss();
        } else if (options.searchType === 'Regex') {
            includes = searchRegex();
            if (includes) {
                description = `The search came back with a match for "<strong style="font-weight: 500">${includes}</strong>"`;
            }
        }
    } else {
        return;
    }

    if (includes) {
        let display = `<div>${description}</div>`;
        let details = { 
            description,
            title
        };
        issueItem.newIssue(title, display, details, html);
    }
}

module.exports = {
    discover,
    id: 'course_search',
    title: 'Course Search',
    description: 'This tool allows you to search Canvas courses\' for given words and/or phrases. The tool will search through the text within the html, the html itself, module items\' external url\'s, and/or the titles of the various items throughout the course.',
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
        key: 'searchThrough',
        description: 'Would you like to search through the HTML or the just the Text?',
        type: 'dropdown',
        choices: ['', 'HTML', 'Text', 'HTML and Text'],
        required: true
    }, {
        title: 'Search Type',
        key: 'searchType',
        description: 'What type of input would you like to search by?',
        type: 'dropdown',
        choices: ['', 'Text', 'CSS Selector', 'Regex'],
        required: true
    }, {
        title: 'Search Titles',
        key: 'searchTitle',
        description: 'Would you like to search the titles as well? If searching by "CSS Selector" then this option will automatically be disabled and titles will not be searched.',
        type: 'dropdown',
        choices: ['', 'Yes', 'No'],
        required: true
    }, {
        title: 'Search Input',
        key: 'searchInput',
        description: `Put your search input here. This search is case insensitive when searching by Text (i.e. it will find all upper and lower case instances of your search) but case sensitive when searching by CSS Selector and Regex. If searching by Regex, do not include the openning and closing "\/" and put a space between the regex expression, and the desired flags (ex: "w04\\s*discussion gi" --> "/w04\\s*discussion/gi").`,
        type: 'text',
        required: true
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};