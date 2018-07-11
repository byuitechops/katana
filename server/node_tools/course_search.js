const cheerio = require('cheerio');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    console.log(canvasItem.constructor.name, options.inputType);
    if (options.inputType === 'Search Text Only') {
        console.log(`Text`, canvasItem.getTitle(), options.searchPhrase);
        if ((canvasItem.constructor.name === 'Module' || canvasItem.constructor.name === 'ModuleItem') && canvasItem.getTitle().toLowerCase().includes(options.searchPhrase)) {
        }
    } else if (options.inputType === 'Search HTML') {
        if (!canvasItem.getHtml() || !canvasItem.getHtml().toLowerCase().includes(options.searchPhrase)) return;
        let $ = cheerio.load(canvasItem.getHtml());
        console.log(`HTML`, options.searchPhrase);
    } else if (options.inputType === 'Search Using Regex' && canvasItem.getHtml() !== undefined) {
        let regex = new RegExp(options.searchPhrase, 'ig');
        let found =  regex.test(canvasItem.getHtml());
        console.log(`Regex`, found, options.searchPhrase);
    }


    // console.log(`Matched`, canvasItem.getTitle());

    let title = 'Search Phrase Matched';
    let description = 'The search came back with a match on this item';
    let display = `
        <div>${description}</div>
        <h3>Matched Text</h3>
        <div>
            ${options.searchPhrase}
        </div>
    `;
    let details = {
        searchPhrase: options.searchPhrase,
        title,
        description
    };

    issueItem.newIssue(title, display, details);
    // images.each((i, image) => {
    //     image = $(image);
    //     var alt = image.attr('alt');

    //     // If the option to get ALL alt attributes is selected, move forward, else check alt it is empty/missing
    //     if (options.altCondition.includes('All image alt') || !alt || alt === '') {

    //         let title = 'Existing Alt Attribute';
    //         let description = 'The alt text on this image should be a good description of the image.';

    //         if (alt === '') {
    //             title = 'Empty Alt Attribute';
    //             description = 'The alt text on this image is empty.';
    //         } else if (!alt) {
    //             title = 'Missing Alt Attribute';
    //             description = 'The alt text on this image is missing.';
    //         }

    //         let display = `
    //             <div>${description}</div>
    //             <h3>Image</h3>
    //             <div class="navy z-depth-1" style="max-width:100%;border-radius:3px;padding:10px 10px 4px 10px;display:inline-block">
    //                 <img style="max-width:100%" src="${image.attr('src')}">
    //             </div>
    //         `;

    //         if (alt) {
    //             display += `
    //                 <h3>Current Alt Text</h3>
    //                 <div class="code-block">${alt}</div>
    //             `;
    //         }

    //         let details = {
    //             image: image.attr('src'),
    //             title,
    //             description
    //         };

    //         issueItem.newIssue(title, display, details);
    //     }
    // });
}

/*****************************************************************
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
                var $ = cheerio.load(canvasItem.getHtml());

                issueItem.issues.forEach(issue => {
                    if (issue.status === 'approved') {

                        let image = $(`img[src="${issue.details.image}"]`).first();
                        if (image && issue.optionValues.newAltText) {
                            $(image).attr('alt', issue.optionValues.newAltText);
                            issue.status = 'fixed';
                        }

                    }
                });

                canvasItem.setHtml($.html());
                await canvasItem.update();
                resolve();
            }
        } catch (e) {
            issueItem.issues.forEach(issue => {
                if (issue.status === 'approved') {
                    issue.status = 'failed';
                }
            });
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'course_search',
    title: 'Course Search',
    description: 'This tool allows you to search Canvas courses\' HTML and item titles for given words and/or phrases.',
    fixedMessage: 'The given search phrase matched',
    icon: 'search',
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
    toolCategory: 'html',
    discoverOptions: [{
        title: 'Input Type',
        key: 'inputType',
        description: 'How would you like to search?',
        type: 'dropdown',
        choices: ['', 'Search Text Only', 'Search HTML', 'Search Using Regex'],
        required: true
    }, {
        title: 'Search Phrase',
        key: 'searchPhrase',
        description: 'What search phrase would you like to look for?',
        type: 'text',
        choices: [],
        required: true
    }],
    fixOptions: [],
};