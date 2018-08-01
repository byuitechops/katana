const cheerio = require('cheerio');

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
        let $ = cheerio.load(canvasItem.getHtml());
        let links = $('a').add('iframe');

        if (options.searchURL) {
            links = links.filter((i, link) => {
                let attribute;
                if (link.name === 'a') {
                    attribute = $(link).attr('href');
                    if (attribute) {
                        return attribute.includes(options.searchURL);
                    } else {
                        return false;
                    }
                } else if (link.name === 'iframe') {
                    attribute = $(link).attr('src');
                    if (attribute) {
                        return attribute.includes(options.searchURL);
                    } else {
                        return false;
                    }
                }
            });
        }

        links.each((i, link) => {
            let title = 'Matching link found',
                description = 'This link should be the correct link',
                display = `<div>${description}</div>`,
                details = {
                    i
                },
                html;

            // Construct the HTML to display to the user
            let linkHtml = `<${$(link)[0].name}`;
            for (let attr in $(link)[0].attribs) {
                linkHtml += ` ${attr}="${$(link)[0].attribs[attr]}"`;
            }
            linkHtml += `>${$(link).html()}</${$(link)[0].name}>`;
            display += '<h3>Current Link<h3>';
            display += linkHtml;
            //
            if (link.name === 'a') {
                html = {
                    currentLink: linkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('href')
                };
            } else if (link.name === 'iframe') {
                html = {
                    currentLink: linkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('src')
                };
            }

            if (options.searchURL) {
                html.highlight = options.searchURL;
            }

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
        try {
            let $ = cheerio.load(canvasItem.getHtml());
            // Get all the links on the page
            let links = $('a').add('iframe');
            // If the user has specified a search phrase, filter the links.
            if (options.searchURL) {
                links = links.filter((i, link) => {
                    let attribute;
                    if (link.name === 'a') {
                        attribute = $(link).attr('href');
                        if (attribute) {
                            return attribute.includes(options.searchURL);
                        } else {
                            return false;
                        }
                    } else if (link.name === 'iframe') {
                        attribute = $(link).attr('src');
                        if (attribute) {
                            return attribute.includes(options.searchURL);
                        } else {
                            return false;
                        }
                    }
                });
            }

            // Make the fix
            issueItem.issues.forEach(issue => {
                // Get the correct link on the page
                let link = links[issue.details.i];
                if (link.name === 'a') {
                    $(link).attr('href', issue.optionValues.newURL);
                    $(link).html(issue.optionValues.newAlias);
                    issue.status = 'fixed';
                } else if (link.name === 'iframe') {
                    $(link).attr('src', issue.optionValues.newURL);
                    $(link).html(issue.optionValues.newAlias);
                    issue.status = 'fixed';
                }
            });
            canvasItem.setHtml($.html());

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
        title: 'Search Phrase',
        key: 'searchURL',
        description: 'A phrase or URL to search for. If left blank, all links will be found',
        type: 'text',
        choices: [],
        required: false
    }],
    // {
    //     title: 'New URL',
    //     key: 'defaultURL',
    //     description: 'What you would like to set the new URL to (You will have a chance to review changes before they are finalized). If left blank each URL will have to be set individually.',
    //     type: 'text',
    //     choices: [],
    //     required: false,
    // }
    fixOptions: [{
        title: 'New URL',
        key: 'newURL',
        description: 'Please enter the new URL for this link.',
        type: 'text',
        choices: [],
        required: true,
    }, {
        title: 'New Alias',
        key: 'newAlias',
        description: 'Please enter the new alias for this link.',
        type: 'text',
        choices: [],
        required: true,
    }],
    editorTabs: [{
        readOnly: true,
        title: 'Current Link HTML',
        htmlKey: 'currentLink'
    }, {
        readOnly: true,
        title: 'Current HTML',
        htmlKey: 'currentHtml'
    }]
};
