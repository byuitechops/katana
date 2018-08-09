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

    if (options.transcriptSearch === 'Existing Transcripts') {
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

        transcriptLinks.each((i, element) => {
            linkHtml = `<${$(element)[0].name}`;
            for (let attr in $(element)[0].attribs) {
                linkHtml += ` ${attr}="${$(element)[0].attribs[attr]}"`;
            }
            linkHtml += '>';
            if ($(element)[0].name !== 'img') {
                linkHtml += `${$(element).html()}</${$(element)[0].name}>`;
            }

            title = 'Existing Transcript Found';
            description = 'This transcript should be correct.';
            display = '<h3>Current Transcript</h3>';
            display += linkHtml;
            display += `<div>${description}</div>`;
            html.transcriptHtml = linkHtml;
            html.highlight = $(element).attr('href');

            issueItem.newIssue(title, display, details, html);

        });
    } else {
    // The user is searching for Missing Transcripts
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
        if (transcriptLinks.length < media.length) {
            $(media).each((i, element) => {
                let siblings = $(element).siblings();
                if (siblings.length > 0) {
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
                            if (children.length > 0) {
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
                                return children.length > 0;
                            } else {
                                return false;
                            }
                        }
                        if (siblingLink.match(/transcript\b/gi)) {
                            return true;
                        }
                        if (siblingHtml.match(/transcript\b/gi)) {
                            return true;
                        }
                        return false;
                    });
                    if (siblings.length === 0) {
                        linkHtml = `<${$(element)[0].name}`;
                        for (let attr in $(element)[0].attribs) {
                            linkHtml += ` ${attr}="${$(element)[0].attribs[attr]}"`;
                        }
                        linkHtml += '>';
                        if ($(element)[0].name !== 'img') {
                            linkHtml += `${$(element).html()}</${$(element)[0].name}>`;
                        }

                        title = 'Possible Missing Transcript Found';
                        description = 'A transcript might be missing for this media.';
                        display = '<h3>Current Media</h3>';
                        display += linkHtml;
                        display += `<div>${description}</div>`;
                        html.transcriptHtml = linkHtml;
                        //html.highlight = $(element).attr('href');

                        issueItem.newIssue(title, display, details, html);
                    }
                } else {
                    linkHtml = `<${$(element)[0].name}`;
                    for (let attr in $(element)[0].attribs) {
                        linkHtml += ` ${attr}="${$(element)[0].attribs[attr]}"`;
                    }
                    linkHtml += '>';
                    if ($(element)[0].name !== 'img') {
                        linkHtml += `${$(element).html()}</${$(element)[0].name}>`;
                    }

                    title = 'Possible Missing Transcript Found';
                    description = 'A transcript might be missing for this media.';
                    display = '<h3>Current Media</h3>';
                    display += linkHtml;
                    display += `<div>${description}</div>`;
                    html.transcriptHtml = linkHtml;
                    html.highlight = linkHtml;

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
    description: 'This tool allows you to search for existing and missing transcripts.',
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
        title: 'Transcript HTML',
        htmlKey: 'transcriptHtml',
        readOnly: true
    }, {
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
