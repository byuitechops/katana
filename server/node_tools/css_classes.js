const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    if (canvasItem.getHtml() == null) return;
    let $ = cheerio.load(canvasItem.getHtml());

    // Use cheerio to get all the elements that have the matching class name
    let className = options.cssClassName.replace(/ /g, '.');
    let matchedElements = $(`.${className}`);
    // Loop through each matched element and create an issue item
    matchedElements.each((i, elem) => {
        let title = 'Matched Class Name';
        let description = 'This HTML element has the specified class.';
        let display = `<div>${description}</div>`;
        let details = {
            i
        };

        // Get the current class HTML to present to the user
        let classHtml = `<${$(elem)[0].name}`;
        for (let attr in $(elem)[0].attribs) {
            classHtml += ` ${attr}="${$(elem)[0].attribs[attr]}"`;
        }
        classHtml += '>';
        if ($(elem)[0].name !== 'img') {
            classHtml += `${$(elem).html()}</${$(elem)[0].name}>`;
        }

        let html = {
            currentHtml: canvasItem.getHtml(),
            currentClassHtml: classHtml,
            highlight: className
        };

        // Add new issues as needed
        issueItem.newIssue(title, display, details, html);
    });
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
            if (canvasItem.getHtml()) {
                // Load the Canvas item
                let $ = cheerio.load(canvasItem.getHtml());
                let className = options.cssClassName.replace(/ /g, '.');
                let matchedElements = $(`.${className}`);
                // Loop through each issue and apply each new class
                issueItem.issues.forEach(issue => {
                    let newClassName = issue.optionValues.newClassName;
                    let element = $(matchedElements[issue.details.i]);

                    // Check if the user wants to edit all class names, or just the searched class names
                    if (issue.optionValues.replaceModify === 'Replace All Classes') {
                        // Replace the old class name(s) with the new class name(s)
                        element.attr('class', newClassName);
                        issue.status = 'fixed';
                    } else {
                        // Remove the searched class name(s) and add the new class name(s)
                        element.removeClass(options.cssClassName);
                        element.addClass(newClassName);
                        issue.status = 'fixed';
                    }
                });
                // Update the HTML on the Canvas item
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
    id: 'css_classes',
    title: 'CSS Classes',
    description: 'This tool allows you to find and replace CSS classes.',
    icon: 'settings_ethernet',
    toolType: 'fix',
    toolCategory: 'html',
    fixMessage: 'CSS class successfully changed',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'cssClassName',
        description: 'The name of the CSS class you would like to change.',
        type: 'text',
        choices: [],
        required: true
    }],
    fixOptions: [{
        title: 'New Class Name',
        key: 'newClassName',
        description: 'Please enter the new class name for this element. This will only change the class that matches exactly what you searched for.',
        type: 'text',
        choices: [],
        required: true
    }, {
        title: 'Replace/Modify',
        key: 'replaceModify',
        description: 'Please select how you would like to alter the class.',
        type: 'dropdown',
        choices: ['', 'Replace All Classes', 'Modify Searched Class(es)'],
        required: true
    }],
    editorTabs: [{
        title: 'HTML Tag',
        htmlKey: 'currentClassHtml',
        readOnly: true
    }, {
        title: 'Full HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
