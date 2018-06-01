/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper 
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function checkItem(item, options) {
    item.issues = [];

    options.badReferences.forEach(badReference => {
        // Check the title
        console.log(item.getTitle());
        var regex = new RegExp(badReference.regex, 'i', 'g');
        if (regex.test(item.getTitle())) {
            console.log('FOUND TITLE');
            item.issues.push({
                title: 'Title Contains Bad Reference',
                description: `The title of this item contains a deprecated reference: ${badReference.normal}.`,
                details: {}
            });
        }
        // Check the body
        if (regex.test(item.getHtml())) {
            console.log('FOUND HTML');
            item.issues.push({
                title: 'Item HTML Contains Bad Reference',
                description: `The HTML of this item, which could be the body or description, contains a deprecated reference: ${badReference.normal}.`,
                details: {}
            });
        }
    });

    console.log(item.issues);

    return item.issues.length > 0;
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
        await course.pages.getComplete();
        await course.assignments.get();
        await course.discussions.get();

        let pages = course.pages.filter(page => checkItem(page, options));
        let assignments = course.assignments.filter(assignment => checkItem(assignment, options));
        let discussions = course.discussions.filter(discussion => checkItem(discussion, options));
        let quizzes = course.quizzes.filter(quiz => checkItem(quiz, options));
        let quizQuestions = course.quizzes.reduce((acc, quiz) => acc.concat(quiz.questions), []).filter(question => checkItem(question, options));

        let allItems = [].concat(pages, assignments, discussions, quizzes, quizQuestions);

        let items = allItems.filter(item => checkItem(item, options));

        resolve(items);
    });
}

const details = {
    id: 'deprecated_references',
    title: 'Deprecated References',
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