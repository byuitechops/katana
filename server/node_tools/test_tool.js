/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper 
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function checkItem(item, options) {

    item.issues = [{
        title: 'Psuedo Issue',
        description: 'This is a fake issue.',
        details: {}
    }];

    return item;
}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues successfully fixed.
 *****************************************************************/
function fix(issueItem, options) {

}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} course - Canvas API wrapper course object
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} issues - All issues discovered or fixed.
 *****************************************************************/
function discover(course, options) {
    return new Promise(async (resolve, reject) => {
        await course.modules.getAll();
        // Would normally run through check() and get array of problem items
        // But this just creates a fake issue on each
        let items = course.modules.map(module => checkItem(module, options));
        resolve(items);
    })
}

const details = {
    id: 'test_tool',
    title: 'Test Tool',
    icon: 'settings',
    categories: [
        'Page',
        'Assignment',
        'Discussion',
        'Quiz',
        'QuizQuestion'
    ],
    discoverOptions: [],
    fixOptions: [],
};

module.exports = {
    fix,
    discover,
    checkItem,
    details
};