const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    if (canvasItem.getHtml() === null) return;
    var $ = cheerio.load(canvasItem.getHtml());
    var codeBlocks = $('code');

    codeBlocks.each((i, codeBlock) => {
        codeBlock = $(codeBlock);
        var langClass = codeBlock.attr('class');

        // If the option to get ALL langClass attributes is selected, move forward, else check langClass it is empty/missing
        if (options.langClassCondition.includes('All code block language classes') || !langClass || langClass === '') {

            let title = 'Existing Language Class';
            let description = 'The language class on this code block should be the correct language.';

            if (langClass === '') {
                title = 'Empty Language Class';
                description = 'The language class text on this code block is empty.';
            } else if (!langClass) {
                title = 'Missing Language Class';
                description = 'The language class text on this code block is missing.';
            } else if (!langClass.includes('language-')) {
                title = 'Incorrect Language Class';
            }

            let display = `
                <div>${description}</div>
            `;

            if (langClass) {
                display += `
                    <h3>Current Language Class</h3>
                    <div class="code-block">${langClass}</div>
                `;
            }

            display += `
                <h3>Code Block</h3>
                <div class="code-block">
                    ${$(codeBlocks).html()}
                </div>
            `;

            let details = {
                langClass,
                title,
                description
            };

            issueItem.newIssue(title, display, details);
        }
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

        console.log(options);
        resolve();
    // try {
    //     if (canvasItem.getHtml()) {
    //         var $ = cheerio.load(canvasItem.getHtml());

    //         issueItem.issues.forEach(issue => {
    //             let codeBlock = $(`img[src="${issue.details.codeBlock}"]`).first();
    //             if (codeBlock && issue.optionValues.newLangText) {
    //                 $(codeBlock).attr('langClass', issue.optionValues.newLangText);
    //                 issue.status = 'fixed';
    //             }
    //         });

    //         canvasItem.setHtml($.html());
    //         await canvasItem.update();
    //         resolve();
    //     }
    // } catch (e) {
    //     issueItem.issues.forEach(issue => {
    //         if (issue.status === 'approved') {
    //             issue.status = 'failed';
    //         }
    //     });
    //     reject(e);
    // }
    });
}

module.exports = {
    discover,
    fix,
    id: 'code_blocks',
    title: 'Code Blocks',
    description: 'This tool allows you to choose which programming language a code block is uses.',
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
        description: 'Do you want to include all code block language classes or just empty and missing languages classes?',
        type: 'dropdown',
        choices: ['', 'All code block language classes', 'Only empty and missing'],
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
};
