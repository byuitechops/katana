/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} itemCard - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, itemCard, options) {

    let title = 'Question Comments Fixed';
    let display = '<div>Many comments have the text but not the HTML, or the HTML is just text and has no < div > tags surrounding the text. This will correct the HTML in this question\'s comments</div>';
    let details = {};

    // different comment types for quiz questions
    let commentTypes = [
        'correct_comments',
        'incorrect_comments',
        'neutral_comments'
    ];

    if ((canvasItem.correct_comments && canvasItem.correct_comments !== '') ||
        (canvasItem.incorrect_comments && canvasItem.incorrect_comments !== '') ||
        (canvasItem.neutral_comments && canvasItem.neutral_comments !== '')) {
        commentTypes.forEach(commentType => {
            // set the html tabs for each potential issue
            let currentHtml = canvasItem[`${commentType}_html`];
            let html = {
                currentHtml,
                updatedHtml: currentHtml,
            };

            if (canvasItem[commentType] && canvasItem[commentType] !== '' &&
                canvasItem[`${commentType}_html`] && canvasItem[`${commentType}_html`] !== '' &&
                !canvasItem[`${commentType}_html`].includes('<div>')) {
                // set the comment type to be used in the fix function
                details.commentType = commentType;

                // set the display
                display += `
                <h3>Before</h3>
                <div><strong>Comment Text:</strong>${canvasItem[commentType]}</div>
                <div><strong>${commentType}_html:</strong>${canvasItem[`${commentType}_html`]}</div>`;

                // set the comment html property to be within a '<div></div>' tag
                html.updatedHtml = `<div>${canvasItem[`${commentType}_html`] || canvasItem[commentType]}</div>`;
                
                // make an issue
                itemCard.newIssue(title, display, details, html);

            } else if (canvasItem[commentType] && canvasItem[commentType] !== '' &&
                (!canvasItem[`${commentType}_html`] || canvasItem[`${commentType}_html`] === '')) {
                // set the comment type to be used in the fix function
                details.commentType = commentType;
                
                // set the display
                display += `
                <h3>Before</h3>
                <div><strong>Comment Text:</strong>${canvasItem[commentType]}</div>
                <div><strong>${commentType}_html:</strong>${canvasItem[`${commentType}_html`]}</div>`;
                
                // set the comment html property to be within a '<div></div>' tag
                html.updatedHtml = `<div>${canvasItem[commentType]}</div>`;

                // make an issue
                itemCard.newIssue(title, display, details, html);
            }
        });
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
            if (itemCard.issues[0].status !== 'approved') return;
            // get the comment type
            let commentType = itemCard.issues[0].details.commentType;
            // set the comment html
            canvasItem[`${commentType}_html`] = itemCard.issues[0].html.updatedHtml;
            // set the status to fixed
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
    id: 'fix_question_comments',
    title: 'Fix Question Comments',
    description: 'Many quiz questions have comments. On conversion from D2L, the comments were copied over but their HTML was copied incorrectly. This tool aims to correct this issue.',
    icon: 'question_answer',
    fixMessage: 'The question comments HTML has been fixed',
    toolType: 'fix',
    toolCategory: 'itemSettings',
    categories: [
        'quizQuestions',
    ],
    discoverOptions: [],
    fixOptions: [],
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
