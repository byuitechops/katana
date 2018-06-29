const cheerio = require('cheerio');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    if (canvasItem.getHtml() === null) return;
    var $ = cheerio.load(canvasItem.getHtml());
    var images = $('img');

    images.each((i, image) => {
        image = $(image);
        var alt = image.attr('alt');

        // If the option to get ALL alt attributes is selected, move forward, else check alt it is empty/missing
        if (options.altCondition.includes('All alt') || !alt || alt === '') {

            let title = 'Existing Alt Attribute';
            let description = 'The alt text on this image should be a good description of the image.';

            if (alt === '') {
                title = 'Empty Alt Attribute';
                description = 'The alt text on this image is empty.';
            } else if (!alt) {
                title = 'Missing Alt Attribute';
                description = 'The alt text on this image is missing.';
            }

            let display = `
                <div style="margin-bottom:10px">${description}</div>
                <img class="card" style="max-width:100%" src="${image.attr('src')}">
            `;

            if (alt) {
                display += `
                    <h3>Current Alt Text</h3>
                    ${alt}
                `;
            }

            let details = {
                image: image.attr('src'),
                title,
                description
            };

            issueItem.newIssue(title, display, details);
        }
    });
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
        } catch (e) {
            issueItem.issues[0].status = 'failed';
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'alt_attributes',
    title: 'Alt Attributes',
    description: 'This will discover images that have missing or empty Alt Text attributes. The user can then provide new alt text for the image. If chosen, the tool can provide all images in the course. Courses will a high number of images may cause delays when navigating through issues. \nYou will NOT be able to see any of the images if you are not signed into Canvas.',
    icon: 'text_rotation_none',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    toolCategory: 'html',
    discoverOptions: [{
        title: 'Conditions',
        key: 'altCondition',
        description: 'Do you want to include all image alt attributes or just empty and missing alt attributes?',
        type: 'dropdown',
        choices: ['', 'All image alt attributes', 'Only empty and missing'],
        required: true
    }],
    fixOptions: [{
        title: 'New Alt Text',
        key: 'newAltText',
        description: 'Please enter the new alt text for this image.',
        type: 'text',
        choices: [],
        required: true
    }],
};
