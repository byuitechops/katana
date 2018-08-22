const canvas = require('canvas-api-wrapper');
let moduleItems = {};
let courseIds = {};
/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {string} course_id - The Canvas item's Course ID
 * @returns {object} - The items retrieved from Canvas
 *****************************************************************/
async function getItems(course_id) {
    let canvasCourse = canvas.getCourse(course_id);
    await canvasCourse.modules.getComplete();
    let courseModuleItems = canvasCourse.modules.getFlattened();
    moduleItems[course_id] = courseModuleItems.filter(item => item.type === 'Quiz' || item.type === 'Discussion' || item.type === 'Assignment');
}
/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
async function discover(canvasItem, issueItem, options) {
    // don't include quizzes or discussions a second time as an assignment. Just grab the assignments if the type is 'Assignment'
    if (canvasItem.constructor.name === 'Assignment' && (canvasItem.discussion_topic !== undefined || canvasItem.is_quiz_assignment !== false)) return; 
    let title = `This ${canvasItem.constructor.name} is located under:`;
    let details = {};
    let display = `
        <ul class="grey lighten-3" style="padding:5px; width: 100px;">
            <li>${canvasItem.constructor.name === 'Quiz' ? 'Quizze' : canvasItem.constructor.name}s</li>
    `;

    // an array of the categories that the current item falls under (i.e. Assignment, Discussion, Quiz)
    let types = [
        canvasItem.constructor.name
    ];
    
    // if it is a new course, get it's quizzes, discussions, and assignments
    if (!Object.values(courseIds).includes(issueItem.course_id)) {
        courseIds[issueItem.course_id] = issueItem.course_id;
        await getItems(issueItem.course_id);
    }

    if (canvasItem.constructor.name === 'Quiz') {
        // if the quiz has a quiz_type of 'assignment' or 'graded_survey', then it is also an assignment
        if (canvasItem.quiz_type === 'assignment' || canvasItem.quiz_type === 'graded_survey') {
            display += '<li>Assignments</li>';
            types.push('Assignment');
        }
    }
    if (canvasItem.constructor.name === 'Discussion') {
        // if the discussion has an 'assignment_id' that isn't null, then it is also an assignment
        if (canvasItem.assignment_id !== null) {
            display += '<li>Assignments</li>';
            types.push('Assignment');
        }
    }
    // check for more than one module item with filter here
    let isModuleItem = moduleItems[issueItem.course_id].find(item => {
        // get the quiz/discussion id off of the module item from the 'url' attribute on the module item
        let id = Number(item.url.split('/').pop());
        return id === canvasItem.id;
    });

    // if it's a module item, push it to the 'types' array
    if (isModuleItem) {
        display += '<li>Module Items</li>';
        types.push('Module Item');
    }

    // close the display's <ul> tag
    display += `
        </ul>
    `;
    
    issueItem.newIssue(title, display, details);
}

module.exports = {
    discover,
    id: 'item_locator',
    title: 'Item Locator (BETA)',
    description: `Canvas items (e.g. discussions, quizzes, etc.) are often located under their own tabs, the Assignments tab, and the Modules tab. This tool will show which tabs each item is located under. <strong>Disclaimer</strong> - This tool runs <em>much</em> slower than most.`,
    icon: 'assignment_turned_in',
    toolType: 'search',
    toolCategory: 'itemSettings',
    categories: [
        'assignments',
        'discussions',
        'quizzes'
    ],
    discoverOptions: [
    //     {
    //     title: 'Search',
    //     key: 'searchBy',
    //     description: 'Do you want to include all image alt attributes or just empty and missing alt attributes?',
    //     type: 'dropdown',
    //     choices: ['', 'Only items missing under the Modules tab', 'Only items missing under the Assignments tab', 'Both'],
    //     required: true
    // }
],
    fixOptions: [],
};
