const cheerio = require('cheerio');

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} itemCard - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, itemCard, options) {
    if (canvasItem.getHtml() === null) return;
    let $ = cheerio.load(canvasItem.getHtml());

    // get the correct course code and stick it into an array, each word being an element
    let codeSegments = options.courseInfo.course_code.split(' ');

    // take the class code array and format it into the css class
    let styleClass = (codeSegments[0] + (codeSegments[1] ? codeSegments[1] : '')).toLowerCase().replace(/:/g, '');
    styleClass = styleClass.replace(/onlinemaster/i, '');

    // return the first element that has the classes 'byui' and the correct course class together, if one exists
    let styleClassEl = $(`div.byui.${styleClass}`).first();

    // if it doesn't exist, stick the classes on a new div that wraps the current html
    if (styleClassEl && styleClassEl.length === 0) {

        // return the first element that has the 'byui' class on it
        let byuiClass = $('div.byui').first();

        // check for the correct classes being present, but formatted incorrectly
        let incorrectLowerCaseClass = $(`.byui${styleClass}`).first();
        let incorrectUpperCaseClass = $(`.byui${styleClass.toUpperCase()}`).first();

        // Remove scripts from the html
        $('script').remove();

        // Cheerio adds an html, head, and body tags, so we just want the contents of the body
        let currentHtml = $('body').html();
        let title, display, currentClasses = null;

        // if there are no elements with the 'byui' class
        if (byuiClass.length === 0 && incorrectLowerCaseClass.length === 0 && incorrectUpperCaseClass.length === 0) {
            title = 'Missing Style Classes';
            display = '<div>The standard style classes ("byui [courseCode]") are missing on this item.</div>';
        } else {
            title = 'Invalid Style Classes';
            if (incorrectLowerCaseClass.length !== 0) {
                currentClasses = $(incorrectLowerCaseClass).attr('class');
            } else if (incorrectUpperCaseClass.length !== 0) {
                currentClasses = $(incorrectUpperCaseClass).attr('class');
            } else {
                currentClasses = $(byuiClass).attr('class');
            }
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

        if (byuiClass.length === 0 && incorrectLowerCaseClass.length === 0 && incorrectUpperCaseClass.length === 0) {
            $('body').html(`<div class="byui ${styleClass}">${$('body').html()}</div>`); // Wrap all of the HTML with the div with the right classes
        } else if (incorrectLowerCaseClass.length !== 0) {
            $(incorrectLowerCaseClass).attr('class', `byui ${styleClass}`); // Correct the existing classes
        } else if (incorrectUpperCaseClass.length !== 0) {
            $(incorrectUpperCaseClass).attr('class', `byui ${styleClass}`); // Correct the existing classes
        } else {
            $(byuiClass).attr('class', `byui ${styleClass}`); // Correct the existing classes
        }

        let updatedHtml = $('body').html();

        let details = {
            currentClasses: '',
            updatedClasses: `byui ${styleClass}`,
        };

        let html = {
            currentHtml,
            updatedHtml
        };

        itemCard.newIssue(title, display, details, html);
    }
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
            if (canvasItem.getHtml() === null) return;
            if (itemCard.issues[0].status !== 'approved') return;
            if (itemCard.issues[0].html.updatedHtml === itemCard.issues[0].html.currentHtml) return;
            // set the html to the updatedHtml from the discover function + the edits they make in the editor
            canvasItem.setHtml(itemCard.issues[0].html.updatedHtml);
            itemCard.issues[0].status = 'fixed';
            resolve();
        } catch (e) {
            itemCard.issues[0].status = 'failed';
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
    toolCategory: 'html',
    toolType: 'fix',
    fixMessage: 'The style classes have been updated on this item',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions',
    ],
    discoverOptions: [
        // {
        //     title: 'Classes to Insert',
        //     key: 'newClasses',
        //     description: `Put the new style classes you'd like to insert here. If you omit 'byui' then it will automatically add it for you.`,
        //     type: 'text',
        //     required: false
        // }
    ],
    editorTabs: [{
        title: 'Updated HTML',
        htmlKey: 'updatedHtml',
        readOnly: false
    }, {
        title: 'Current HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};