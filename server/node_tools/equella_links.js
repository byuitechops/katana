const cheerio = require('cheerio');
const canvas = require('canvas-api-wrapper');

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper 
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues discovered.
 *****************************************************************/
function checkItem(item, options) {
    item.issues = [];

    if (item.getHtml() === null) return false;

    var $ = cheerio.load(item.getHtml());
    var links = $('a').get();

    /* If there aren't any links in the item then return */
    if (links.length === 0) {
        return false;
    }

    links.forEach(link => {
        var oldUrl = '';
        /* Assign the oldUrl name for logging purposes */
        if ($(link).attr('href')) {
            oldUrl = $(link).attr('href');
        }

        /* Check if the link has an href, and if it is already the correct href */
        if ($(link).attr('href') &&
            $(link).attr('href').includes('content.byui.edu/file/') &&
            !$(link).attr('href').includes('content.byui.edu/integ/gen/')) {
            var newUrl = $(link).attr('href');
            newUrl = newUrl.replace(/\/file\//i, '/integ/gen/');
            newUrl = newUrl.replace(/\/\d+\//i, '/0/');

            item.issues.push({
                title: 'HTML Static Equella Link',
                description: `Contains an equella link that points to a specific version. It should be changed to automatically go to the newest version.`,
                details: {
                    oldUrl,
                    newUrl
                }
            });
        }
    });

    return item;
}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} item - Canvas item produced by the Canvas API Wrapper
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} fixedIssues - All issues successfully fixed.
 *****************************************************************/
async function fix(issueItem, options) {
    let course = canvas.getCourse(issueItem.course_id);
    let canvasItem;

    if (issueItem.item_type == 'Page') {
        canvasItem = await course.pages.getOne(issueItem.item_id);
    } else if (issueItem.item_type === 'Assignment') {
        canvasItem = await course.assignments.getOne(issueItem.item_id);
    } else if (issueItem.item_type === 'Discussion') {
        canvasItem = await course.discussions.getOne(issueItem.item_id);
    } else if (issueItem.item_type === 'Quiz') {
        canvasItem = await course.quizzes.getOne(issueItem.item_id);
    }

    if (!canvasItem) {
        console.log('CRAZY', canvasItem, issueItem);
        return issueItem;
    }

    var $ = cheerio.load(canvasItem.getHtml());

    issueItem.issues.forEach(issue => {
        if (issue.status === 'approved') {
            let link = $(`a[href="${issue.details.oldUrl}"]`).first();
            if (!link) {
                issue.status = 'fixed';
            } else {
                $(link).attr('href', issue.details.newUrl);
                issue.status = 'fixed';
            }
        }
    });

    canvasItem.setHtml($.html());
    await canvasItem.update();
    return issueItem;
}

/*****************************************************************
 * Runs the prescribed fix on each item provided.
 * @param {object} course - Canvas API wrapper course object
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {array} issues - All issues discovered or fixed.
 *****************************************************************/
function discover(course, options) {
    return new Promise(async (resolve, reject) => {
        await course.assignments.get();
        await course.discussions.get();
        // await course.modules.getComplete();
        await course.pages.getComplete();
        await course.quizzes.getComplete();

        let assignments = course.assignments.filter(assignment => checkItem(assignment, options));
        let discussions = course.discussions.filter(discussion => checkItem(discussion, options));
        // let moduleItems = course.modules.reduce((acc, module) => acc.concat(module.items), []).filter(module => checkItem(module, options));
        let pages = course.pages.filter(page => checkItem(page, options));
        let quizzes = course.quizzes.filter(quiz => checkItem(quiz, options));
        // let quizQuestions = course.quizzes.reduce((acc, quiz) => acc.concat(quiz.questions), []).filter(question => checkItem(question, options));

        let allItems = [].concat(pages, assignments, discussions, quizzes);

        let items = allItems.map(item => checkItem(item, options));
        items = items.filter(item => item.issues.length > 0);

        resolve(items);
    })
}

const details = {
    name: 'equella_links',
    itemTypes: [
        'Page',
        'Assignment',
        'Discussion',
        'Quiz',
        'QuizQuestion'
    ]
};

module.exports = {
    fix,
    discover,
    checkItem,
    details
};