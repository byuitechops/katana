const cheerio = require('cheerio');

/******************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    // Create the necessary variables to create issue items
    let title = 'Matching link found',
        description = 'This link should be correct.',
        display = '',
        linkHtml = '',
        details,
        html;

    // Check if the issue item is a module item
    if (issueItem.category === 'moduleItems') {
    // Get the external url
        let link = canvasItem.external_url;
        // Check if the link is truthy
        if (link) {
            // Check if the user provided a search parameter
            if (options.searchURL) {
                // Check if the link contains the search parameter
                if (link.includes(options.searchURL)) {
                    // Set the issue item variables
                    title = 'Matching External URL Found';
                    description = 'This external URL should be correct.';
                    display += '<h3>Current External URL</h3>';
                    display += `<a href="${link}" target="_blank">${link}</a>`;
                    display += `<div>${description}</div>`;
                    // Create the issue item
                    issueItem.newIssue(title, display, details);
                }
            } else {
                // Set the issue item variables
                title = 'Matching External Link Found';
                description = 'This external link should be correct.';
                display += '<h3>Current External Link</h3>';
                display += `<a href="${link}" target="_blank">${link}</a>`;
                display += `<div>${description}</div>`;
                // Create the issue item
                issueItem.newIssue(title, display, details);
            }
        }
    } else {
    // Load the canvas item's HTML into cheerio
        let $ = cheerio.load(canvasItem.getHtml());
        // Get all the anchor, iframe, and image tags
        let links = $('a').add('iframe').add('img');
        // Check if the user provided a search parameter
        if (options.searchURL) {
            // Filter the links by the provided search parameter
            links = links.filter((i, link) => {
                let attribute;
                if (link.name === 'a') {
                    attribute = $(link).attr('href');
                    if (attribute) {
                        return attribute.toLowerCase().includes(options.searchURL.toLowerCase());
                    } else {
                        return false;
                    }
                } else if (link.name === 'iframe' || link.name === 'img') {
                    attribute = $(link).attr('src');
                    if (attribute) {
                        return attribute.toLowerCase().includes(options.searchURL.toLowerCase());
                    } else {
                        return false;
                    }
                }
            });
        }
        // Loop through each link and create an issue item
        links.each((i, link) => {
            // Construct the HTML to display to the user
            linkHtml = `<${$(link)[0].name}`;
            for (let attr in $(link)[0].attribs) {
                linkHtml += ` ${attr}="${$(link)[0].attribs[attr]}"`;
            }
            linkHtml += `>${$(link).html()}</${$(link)[0].name}>`;

            // Give details the current index. This will be used in fix() to determine which link on a canvas item to fix
            details = {
                i
            };

            // Set the issue item variables for the correct type of html tag (a, iframe, img)
            if (link.name === 'a') {
                display += '<h3>Current Link</h3>';
                title = 'Matching Anchor Tag Link Found';
                html = {
                    currentLink: linkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('href')
                };
            } else
            if (link.name === 'iframe') {
                display += '<h3>Current iframe</h3>';
                title = 'Matching Iframe Source Found';
                description = 'This iframe should be correct.',
                html = {
                    currentLink: linkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('src')
                };
            } else if (link.name === 'img') {
                display += '<h3>Current Image</h3>';
                title = 'Matching Image Source Found';
                description = 'This image should be correct.',
                html = {
                    currentLink: linkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('src')
                };
            }
            display += linkHtml;
            display += `<div>${description}</div>`;

            // If the user provided a search paramter, highlight what they searched for in the html editor
            if (options.searchURL) {
                html.highlight = options.searchURL;
            }

            // Create the issue item
            issueItem.newIssue(title, display, details, html);
        });
    }
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
            // Check if the issue item is a module item
            if (issueItem.category === 'moduleItems') {
                // Set the external url and title to the user provided values
                canvasItem.external_url = issueItem.issues[0].optionValues.newURL;
                canvasItem.setTitle(issueItem.issues[0].optionValues.newAlias);
                // Set the status to fixed
                issueItem.issues[0].status = 'fixed';
                resolve();
            } else {
                // Load the canvas item's HTML into cheerio
                let $ = cheerio.load(canvasItem.getHtml());
                // Get all the anchor, iframe, and image tags on the page
                let links = $('a').add('iframe').add('img');
                // Filter the links if the user provided a search parameter
                if (options.searchURL) {
                    // Filter the links by the provided search parameter
                    links = links.filter((i, link) => {
                        let attribute;
                        if (link.name === 'a') {
                            attribute = $(link).attr('href');
                            if (attribute) {
                                return attribute.toLowerCase().includes(options.searchURL.toLowerCase());
                            } else {
                                return false;
                            }
                        } else if (link.name === 'iframe' || link.name === 'img') {
                            attribute = $(link).attr('src');
                            if (attribute) {
                                return attribute.toLowerCase().includes(options.searchURL.toLowerCase());
                            } else {
                                return false;
                            }
                        }
                    });
                }

                // Make the fixes
                issueItem.issues.forEach(issue => {
                    // Using the index we passed in from discover(), get the correct link on the page
                    let link = links[issue.details.i];
                    // Change the attributes for the correct tag(a, iframe, img) and set the status to fixed
                    if (link.name === 'a') {
                        $(link).attr('href', issue.optionValues.newURL);
                        $(link).html(issue.optionValues.newAlias);
                        issue.status = 'fixed';
                    } else if (link.name === 'iframe') {
                        $(link).attr('src', issue.optionValues.newURL);
                        $(link).html(issue.optionValues.newAlias);
                        issue.status = 'fixed';
                    } else if (link.name === 'img') {
                        $(link).attr('alt', issue.optionValues.newAlias);
                        issue.status = 'fixed';
                    }
                });
                // Set the HTML to the cheerio changed HTML
                canvasItem.setHtml($.html());

                resolve();
            }
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
        description: 'Please enter the new URL for this link, iframe, or image.',
        type: 'text',
        choices: [],
        required: true,
    }, {
        title: 'New Link Alias/Iframe Error Text/Image Alt Text',
        key: 'newAlias',
        description: 'Please enter the new link alias, iframe error text, or image alt text for this issue.',
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
