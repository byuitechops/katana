const cheerio = require('cheerio');
const he = require('he');

/******************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    // Create the necessary variables to create issue items
    let title = 'Matching link found',
        display = '',
        linkHtml = '',
        proposedLinkHtml = '',
        details,
        html;

    // Use he to decode any named and numerical character references in the searched URL. Canvas, by default, has these in their content editor
    options.searchURL = he.decode(options.searchURL);

    // Check if the issue item is a module item
    if (issueItem.category === 'moduleItems') {
    // Get the external url
        let link = canvasItem.external_url;
        // Check if the link is truthy
        if (link !== undefined) {
            // Check if the user provided a search parameter
            if (options.searchURL) {
                // Check if the link is equal to the search parameter
                if (link === options.searchURL) {
                    // Set the issue item variables
                    title = 'Matching External URL Found';
                    display += '<h3>Current External URL</h3>';
                    display += `<a href="${link}" target="_blank">${link}</a>`;
                    display += '<h3>Proposed External Link</h3>';
                    display += `<a href="${options.defaultURL} target="_blank">${options.defaultURL}</a>`;
                    // Create the issue item
                    issueItem.newIssue(title, display, details);
                }
            } else {
                // Set the issue item variables
                title = 'Matching External Link Found';
                display += '<h3>Current External Link</h3>';
                display += `<a href="${link}" target="_blank">${link}</a>`;
                display += '<h3>Proposed External Link</h3>';
                display += `<a href="${options.defaultURL} target="_blank">${options.defaultURL}</a>`;
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
                        return attribute === options.searchURL;
                    } else {
                        return false;
                    }
                } else if (link.name === 'iframe' || link.name === 'img') {
                    attribute = $(link).attr('src');
                    if (attribute) {
                        return attribute === options.searchURL;
                    } else {
                        return false;
                    }
                }
            });
        }
        // Loop through each link and create an issue item
        links.each((i, link) => {
            // Reset the display for each issue item
            display = '';
            // Construct the current link HTML to display to the user
            linkHtml = `<${$(link)[0].name}`;
            for (let attr in $(link)[0].attribs) {
                linkHtml += ` ${attr}="${$(link)[0].attribs[attr]}"`;
            }
            linkHtml += '>';
            if ($(link)[0].name !== 'img') {
                linkHtml += `${$(link).html()}</${$(link)[0].name}>`;
            }

            // Construct the proposed link HTML to display to the user
            proposedLinkHtml = `<${$(link)[0].name}`;
            for (let attr in $(link)[0].attribs) {
                if (attr === 'href' || attr === 'src') {
                    proposedLinkHtml += ` ${attr}="${options.defaultURL}"`;
                } else if (attr === 'alt') {
                    if (options.newAlias) {
                        proposedLinkHtml += `${attr}="${options.newAlias}"`;
                    } else {
                        proposedLinkHtml += `${attr}="${$(link)[0].attribs[attr]}"`;
                    }
                } else {
                    proposedLinkHtml += `${attr}="${$(link)[0].attribs[attr]}"`;
                }
            }
            proposedLinkHtml += '>';
            if ($(link)[0].name !== 'img') {
                if (options.newAlias) {
                    proposedLinkHtml += `${options.newAlias}</${$(link)[0].name}>`;
                } else {
                    proposedLinkHtml += `${$(link).html()}</${$(link)[0].name}>`;
                }
            }

            // Give details the current index. This will be used in fix() to determine which link on a canvas item to fix
            details = {
                i
            };

            // Set the issue item variables for the correct type of html tag (a, iframe, img)
            if (link.name === 'a') {
                display += '<h3>Current Link</h3>';
                display += linkHtml;
                display += '<h3>Proposed Link</h3>';
                display += proposedLinkHtml;
                title = 'Matching Anchor Tag Link Found';
                html = {
                    currentLink: linkHtml,
                    proposedLink: proposedLinkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('href')
                };
            } else
            if (link.name === 'iframe') {
                display += '<h3>Current iframe</h3>';
                display += linkHtml;
                display += '<h3>Proposed Iframe Source</h3>';
                display += proposedLinkHtml;
                title = 'Matching Iframe Source Found';
                html = {
                    currentLink: linkHtml,
                    proposedLink: proposedLinkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('src')
                };
            } else if (link.name === 'img') {
                display += '<h3>Current Image</h3>';
                display += linkHtml;
                display += '<h3>Proposed Image Source</h3>';
                display += proposedLinkHtml;
                title = 'Matching Image Source Found';
                html = {
                    currentLink: linkHtml,
                    proposedLink: proposedLinkHtml,
                    currentHtml: canvasItem.getHtml(),
                    highlight: $(link).attr('src')
                };
            }

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
            // Use he to decode any named and numerical character references in the searched URL. Canvas, by default, has these in their content editor
            options.searchURL = he.decode(options.searchURL);
            // Check if the issue item is a module item
            if (issueItem.category === 'moduleItems') {
                // Set the external url and title to the user provided values
                canvasItem.external_url = options.defaultURL;
                if (options.newAlias) {
                    canvasItem.setTitle(options.newAlias);
                }
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
                                return attribute === options.searchURL;
                            } else {
                                return false;
                            }
                        } else if (link.name === 'iframe' || link.name === 'img') {
                            attribute = $(link).attr('src');
                            if (attribute) {
                                return attribute === options.searchURL;
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
                        $(link).attr('href', options.defaultURL);
                        if (options.newAlias) {
                            $(link).html(options.newAlias);
                        }
                        issue.status = 'fixed';
                    } else if (link.name === 'iframe') {
                        $(link).attr('src', options.defaultURL);
                        if (options.newAlias) {
                            $(link).html(options.newAlias);
                        }
                        issue.status = 'fixed';
                    } else if (link.name === 'img') {
                        $(link).attr('src', options.defaultURL);
                        if (options.newAlias) {
                            $(link).attr('alt', options.newAlias);
                        }
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
        title: 'Search URL',
        key: 'searchURL',
        description: 'A URL to search for. This is required and MUST be correct.',
        type: 'text',
        choices: [],
        required: true
    },
    {
        title: 'New URL',
        key: 'defaultURL',
        description: 'The new URL to replace the searched URL. This is required and MUST be correct.',
        type: 'text',
        choices: [],
        required: true,
    },
    {
        title: '(Optional) New Link Alias/Iframe Error Text/Image Alt Text',
        key: 'newAlias',
        description: 'Please enter the new link alias, iframe error text, or image alt text for this URL.',
        type: 'text',
        choices: [],
        required: false,
    }
    ],
    fixOptions: [],
    editorTabs: [{
        readOnly: true,
        title: 'Current Link HTML',
        htmlKey: 'currentLink'
    }, {
        readOnly: true,
        title: 'Proposed Link HTML',
        htmlKey: 'proposedLink'
    }, {
        readOnly: true,
        title: 'Current HTML',
        htmlKey: 'currentHtml'
    }]
};
