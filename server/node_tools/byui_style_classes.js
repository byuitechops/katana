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

    let codeSegments = options.courseInfo.course_code.split(' ');

    let styleClass = (codeSegments[0] + (codeSegments[1] ? codeSegments[1] : '')).toLowerCase().replace(/:/g, '');

    let styleClassEl = $(`.byui.${styleClass}`).first();

    if (styleClassEl && styleClassEl.length === 0) {

        let byuiClass = $('.byui').first();

        // Remove scripts from the html
        $('script').remove();

        // Cheerio adds an html, head, and body tags, so we just want the contents of the body
        let currentHtml = $('body').html();
        let title, display, currentClasses = null;

        if (byuiClass.length === 0) {
            title = 'Missing Style Classes';
            display = '<div>The standard style classes ("byui [courseCode]") are missing on this item.</div>';
        } else {
            title = 'Invalid Style Classes';
            currentClasses = $(byuiClass).attr('class');
            display = `
                <div>The standard style classes ("byui [courseCode]") are incorrect on this item.</div>
                <h3>Current Classes</h3>
                <div class="code-block">${currentClasses}</div>
            `;
        }

        display += `
            <h3>Updated Classes</h3>
            <div style="padding-bottom:15px">This is what the classes will look like after being updated.</div>
            <div class="code-block">byui ${styleClass}</div>
        `;

        if (byuiClass.length === 0) {
            // Wrap all of the HTML with the div with the right classes
            $('body').html(`<div class="byui ${styleClass}">${$('body').html()}</div>`);
        } else {
            // Correct the existing classes
            $(byuiClass).attr('class', `byui ${styleClass}`);
        }

        let updatedHtml = $('body').html();

        let details = {
            currentClasses: '',
            updatedClasses: `byui ${styleClass}`,
            currentHtml,
            updatedHtml
        };

        issueItem.newIssue(title, display, details);
    }
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
            if (canvasItem.getHtml() === null) return;
            if (issueItem.issues[0].status !== 'approved') return;
            var $ = cheerio.load(canvasItem.getHtml());

            let byuiClass = $('.byui').first();

            if (byuiClass.length === 0) {
                // Wrap all of the HTML with the div with the right classes
                $('body').html(`<div class="${issueItem.issues[0].details.updatedClasses}">${$('body').html()}</div>`);
            } else {
                // Correct the existing classes
                $(byuiClass).attr('class', issueItem.issues[0].details.updatedClasses);
            }

            canvasItem.setHtml($.html());
            issueItem.issues[0].status = 'fixed';
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
    id: 'byui_style_classes',
    title: 'BYUI Style Classes',
    description: 'Courses require two style classes on every segment of HTML in a course in order to apply CSS specific to the course. This tool identifies any items in each course that are missing or have the incorrect style classes.',
    icon: 'style',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    toolCategory: 'html',
    discoverOptions: [],
    fixOptions: [],
};
