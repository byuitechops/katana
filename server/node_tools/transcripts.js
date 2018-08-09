const cheerio = require('cheerio');
/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    let $ = cheerio.load(canvasItem.getHtml());
    let title = '';
    let description = '';
    let display = '';
    let details = {};
    let linkHtml = '';
    let html = {
        currentHtml: canvasItem.getHtml()
    };
    let transcriptTypes = {
        '.rtf': 'Rich Text Format',
        '.pdf': 'PDF',
        '.html': 'HTML File',
        '.docx': 'Word Document',
        'docs.google.com': 'Google Drive Document',
        'byui.instructure.com': 'Canvas File',
        'amara.org': 'Amara Subtitles',
        'content.byui.edu': 'Equella File'
    };

    // Check if the user is searching for existing for missing transcripts
    if (options.transcriptSearch === 'Existing Transcripts') {
    // Get all the existing transcripts 
        let transcriptLinks = $('a').filter((i, element) => {
            let link = $(element).attr('href');
            let linkHtml = $(element).html();
            if (link) {
                if (link.match(/transcript\b/gi)) {
                    return true;
                }
            }
            if (linkHtml) {
                if (linkHtml.match(/transcript\b/gi)) {
                    return true;
                }
            }
            return false;
        });

        // For each transcript make an issue item
        transcriptLinks.each((i, element) => {
            html = {
                currentHtml: canvasItem.getHtml()
            };
            // Create the iframe, video, or audio tag to display to the user
            linkHtml = `<${$(element)[0].name}`;
            for (let attr in $(element)[0].attribs) {
                linkHtml += ` ${attr}="${$(element)[0].attribs[attr]}"`;
            }
            linkHtml += '>';
            if ($(element)[0].name !== 'img') {
                linkHtml += `${$(element).html()}</${$(element)[0].name}>`;
            }

            // Determine the file type of the transcript
            let linkType = $(element).attr('href');
            linkType = Object.keys(transcriptTypes).filter(type => linkType.includes(type))[0];
            // Check if the link that was found is of an unknown type
            if (!linkType) {
                linkType = 'Unknown Type';
            }

            // Set the necessary variables to create the issue item
            title = 'Existing Transcript Found';
            description = 'This transcript should be correct.';
            display = '<h3>Current Transcript</h3>';
            display += linkHtml;
            display += `<div>${description}</div>`;
            display += '<h3>Transcript Type</h3>';
            display += transcriptTypes[linkType];
            html.transcriptHtml = linkHtml;
            html.highlight = $(element).attr('href');

            // Make the issue item
            issueItem.newIssue(title, display, details, html);

        });
    } else {
    // The user is searching for Missing Transcripts
    // First get all the media and transcript links from the page
        let media = $('iframe').add('video').add('audio');
        let transcriptLinks = $('a').filter((i, element) => {
            let link = $(element).attr('href');
            let linkHtml = $(element).html();
            if (link) {
                if (link.match(/transcript\b/gi)) {
                    return true;
                }
            }
            if (linkHtml) {
                if (linkHtml.match(/transcript\b/gi)) {
                    return true;
                }
            }
            return false;
        });

        // Check if there are less transcripts than media on the page
        if (transcriptLinks.length < media.length) {
            // Loop through each piece of media on the page
            $(media).each((i, element) => {
                // Get the siblings of the current media element
                let siblings = $(element).siblings();
                // Check if there are siblings
                if (siblings.length > 0) {
                    // Filter the siblings down to the ones that are transcripts
                    siblings = siblings.filter((i, sibling) => {
                        let siblingLink = '',
                            siblingHtml = '';
                        // Check if the current sibling is an anchor tag
                        if (sibling.name === 'a') {
                            siblingLink = $(sibling).attr('href');
                            siblingHtml = $(sibling).html();
                        } else {
                            // Check the sibling's children for anchor tags
                            let children = $(sibling).children('a');
                            // Check if there are anchor tag children
                            if (children.length > 0) {
                                // Filter the children down to just the ones that contain transcript links
                                children = children.filter((i, child) => {
                                    let childLink = $(child).attr('href'),
                                        childHtml = $(child).html();
                                    if (childLink.match(/transcript\b/gi)) {
                                        return true;
                                    }
                                    if (childHtml.match(/transcript\b/gi)) {
                                        return true;
                                    }
                                    return false;
                                });
                                // Returns true if any of the children contained an anchor tag transcript link
                                return children.length > 0;
                            } else {
                                // No anchor tag children were found
                                // This is a good indicator that a transcript is missing or the link is not to standard
                                return false;
                            }
                        }
                        // Check if the sibling has the word transcript in its href
                        if (siblingLink.match(/transcript\b/gi)) {
                            return true;
                        }
                        // Check if the sibling has the word transcript in its inner html
                        if (siblingHtml.match(/transcript\b/gi)) {
                            return true;
                        }
                        // The word transcript wasn't found in either the href or inner html
                        // This is a good indicator that a transcript is missing or the link is not to standard
                        return false;
                    });
                    // If the siblings length is 0 then no sibling anchor tags were found containing the word transcript
                    if (siblings.length === 0) {
                        html = {
                            currentHtml: canvasItem.getHtml()
                        };
                        // Create the iframe, video, or audio tag to display to the user
                        linkHtml = `<${$(element)[0].name}`;
                        for (let attr in $(element)[0].attribs) {
                            linkHtml += ` ${attr}="${$(element)[0].attribs[attr]}"`;
                        }
                        linkHtml += '>';
                        if ($(element)[0].name !== 'img') {
                            linkHtml += `${$(element).html()}</${$(element)[0].name}>`;
                        }

                        // Set the necessary variables to create the issue item
                        title = 'Possible Missing Transcript Found';
                        description = 'A transcript might be missing for this media.';
                        display = '<h3>Current Media</h3>';
                        display += linkHtml;
                        display += `<div>${description}</div>`;
                        html.transcriptHtml = linkHtml;
                        html.highlight = linkHtml;

                        // Make the issue item
                        issueItem.newIssue(title, display, details, html);
                    }
                } else {
                    html = {
                        currentHtml: canvasItem.getHtml()
                    };
                    // Create the iframe, video, or audio tag to display to the user
                    linkHtml = `<${$(element)[0].name}`;
                    for (let attr in $(element)[0].attribs) {
                        linkHtml += ` ${attr}="${$(element)[0].attribs[attr]}"`;
                    }
                    linkHtml += '>';
                    if ($(element)[0].name !== 'img') {
                        linkHtml += `${$(element).html()}</${$(element)[0].name}>`;
                    }

                    // Set the necessary variables to create the issue item
                    title = 'Possible Missing Transcript Found';
                    description = 'A transcript might be missing for this media.';
                    display = '<h3>Current Media</h3>';
                    display += linkHtml;
                    display += `<div>${description}</div>`;
                    html.transcriptHtml = linkHtml;
                    html.highlight = linkHtml;

                    // Make the issue item
                    issueItem.newIssue(title, display, details, html);
                }
            });
        }
    }
}

module.exports = {
    discover,
    id: 'transcripts',
    title: 'Transcripts',
    description: 'This tool allows you to search iframe, video, and audio tags for existing or missing transcripts.',
    icon: 'find_in_page',
    toolType: 'search',
    toolCategory: 'html',
    fixMessage: '',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'transcriptSearch',
        description: 'Do you want to search for existing transcripts or missing transcripts?',
        type: 'dropdown',
        choices: ['', 'Existing Transcripts', 'Missing Transcripts'],
        required: true
    }],
    fixOptions: [],
    editorTabs: [{
        title: 'Media HTML',
        htmlKey: 'transcriptHtml',
        readOnly: true
    }, {
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
