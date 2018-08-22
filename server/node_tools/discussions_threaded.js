/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {

    if (canvasItem.discussion_type !== 'threaded') {

        let title = 'Threaded Replies Disabled';
        let display = '<div>This will enable the "Allow threaded replies" setting on this discussion board.</div>';
        let details = {};

        issueItem.newIssue(title, display, details);
    }
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
        if (issueItem.issues[0].status !== 'approved') return;
        try {
            canvasItem.discussion_type = 'threaded';
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
    id: 'discussions_threaded',
    title: 'Threaded Discussions',
    description: 'Discussion Topics should always have the "Allow threaded replies" setting enabled. This tool discovers discussions that do not have it enabled and will enable it for you.',
    icon: 'question_answer',
    fixMessage: 'The "Allow threaded replies" setting has been enabled',
    toolType: 'fix',
    toolCategory: 'itemSettings',
    categories: [
        'discussions',
    ],
    discoverOptions: [],
    fixOptions: [],
};
