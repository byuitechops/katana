const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} itemCard - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, itemCard, options) {
    // If the Canvas Item's HTML returns null, return
    if (canvasItem.getHtml() === null) return;
    // Load the Canvas item into Cheerio
    let $ = cheerio.load(canvasItem.getHtml());
    // Get all the code blocks in the Canvas item
    let codeBlocks = $('code');

    // Loop through each code block, run checks on each one
    codeBlocks.each((i, codeBlock) => {
        let langClass = $(codeBlock).attr('class');

        // If the option to get ALL language classes is selected, move forward, otherwise check if langClass is empty, incorrect, or missing
        if (options.langClassCondition.includes('All code block language classes') || !langClass || langClass === '' || !langClass.includes('language-')) {

            // Set the default title, description, and html
            let title = 'Existing Language Class';
            let description = 'The language class on this code block should be the correct language.';
            let html = {
                currentCodeBlock: '',
                currentHtml: canvasItem.getHtml(),
            };

            // Perform checks on langClass
            if (langClass === '') {
                title = 'Empty Language Class';
                description = 'The language class on this code block is empty.';
                html.currentCodeBlock = `<code class="">${$(codeBlock).html()}</code>`;
            } else if (!langClass) {
                title = 'Missing Language Class';
                description = 'The language class on this code block is missing.';
                html.currentCodeBlock = `<code>${$(codeBlock).html()}</code>`;
            } else if (!langClass.includes('language-')) {
                title = 'Incorrect Language Class';
                description = 'The language class on this code block is incorrect.';
                html.currentCodeBlock = `<code class="${langClass}">${$(codeBlock).html()}</code>`;
            } else {
                html.currentCodeBlock = `<code class="${langClass}">${$(codeBlock).html()}</code>`;
            }

            // Create the display for the issue card
            let display = `
                <div>${description}</div>
            `;

            // Add a code-block if langClass is truthy or empty
            if (langClass || langClass === '') {
                display += `
                    <h3>Current Language Class</h3>
                    <div class="code-block">class="${langClass}"</div>
                `;
            }

            // Set the details to be passed on
            let details = {
                i,
                title,
                description
            };

            // Create the itemCard
            itemCard.newIssue(title, display, details, html);
        }
    });
}

/** ***************************************************************
 * Fixes issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} itemCard - The IssueItem for the item, including its issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function fix(canvasItem, itemCard, options) {
    return new Promise(async (resolve, reject) => {
        try {
            //Check if the Canvas item is empty, if so return
            if (canvasItem.getHtml()) {
                // Load the Canvas item
                let $ = cheerio.load(canvasItem.getHtml());
                // Get all of the code blocks
                let codeBlocks = $('code');

                // Loop through each issue item
                itemCard.issues.forEach(issue => {
                    // Get the correct code block for this item. i is the index to the correct code block to edit
                    let codeBlock = $(codeBlocks[issue.details.i]);
                    // Check if codeBlock and newLangText are truthy, if so change the language class and set the status to fixed
                    if (codeBlock && issue.optionValues.newLangText) {
                        $(codeBlock).attr('class', `language-${issue.optionValues.newLangText}`);
                        issue.status = 'fixed';
                    }
                });

                // Update the HTML in Canvas
                canvasItem.setHtml($.html());
                resolve();
            }
        } catch (e) {
            itemCard.issues.forEach(issue => {
                issue.status = 'failed';
            });
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'code_blocks',
    title: 'Code Blocks',
    description: 'This tool allows you to choose which programming language a code block uses.',
    icon: 'aspect_ratio',
    toolType: 'fix',
    toolCategory: 'html',
    fixedMessage: 'The new language class attribute has been inserted',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'langClassCondition',
        description: 'Do you want to include all code block language classes or just empty, incorrect, and missing languages classes?',
        type: 'dropdown',
        choices: ['', 'All code block language classes', 'Only empty, incorrect, and missing language classes'],
        required: true
    }],
    fixOptions: [{
        title: 'New Language Class',
        key: 'newLangText',
        description: 'Please choose the correct programming language for this code block.',
        type: 'dropdown',
        choices: ['',
            'aspnet',
            'c',
            'clike',
            'cpp',
            'csharp',
            'css',
            'bash',
            'java',
            'javascript',
            'json',
            'kotlin',
            'lisp',
            'markup',
            'markup-templating',
            'php',
            'plsql',
            'powershell',
            'python',
            'r',
            'sql',
            'scss',
            'typescript',
        ],
        required: true
    }],
    editorTabs: [{
        title: 'Current Code Block',
        htmlKey: 'currentCodeBlock',
        readOnly: true
    }, {
        title: 'Current HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
