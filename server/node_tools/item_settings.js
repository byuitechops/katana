/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
function discover(canvasItem, issueItem, options) {
    // TODO: Find out which option items selected match with the canvas item's available options
    // TODO: Dynamically make the fix options appear(Object Array)

    let title = 'Canvas Item';
    let description = 'This item contains matched settings.'; // a description of the discover type that will be displayed on the issue card
    let display = `<div>${description}</div>`; // the html that will be displayed on the issue card
    let html = {
        currentHtml: canvasItem.getHtml(), // set the html for the editorTab, if applicable
        highlight: options.highlight // if you are going to highlight something in the editor, assign the string here (i.e. search results)
    };
    // 
    let selectedSettings = [...options.selectedSettings];
    //let inconsistentAttribs = ['title'];

    // Check if any inconsistent attributes were selected (i.e: title)
    if (selectedSettings.includes('title')) {
        selectedSettings.push('name');
    }

    // Filter the selected settings so that they appear only if they are on the canvas item
    let matchedSettings = selectedSettings.filter(setting => {
        return Object.keys(canvasItem).includes(setting);
    });

    // Dynamically create the display so that the correct editable elements appear
    if (matchedSettings.length > 0) {
        display += '<h3>Current Settings</h3><div class="code-block">';
        matchedSettings.forEach(matchedSetting => {
            if (canvasItem[matchedSetting]) {
                display += `<div>${matchedSetting}: ${canvasItem[matchedSetting]}</div>`;
            }
        });
        display += '</div>';
        let details = {}; // an object containing anything needing to be referenced in the fix function 
        // Add new issues as needed
        issueItem.newIssue(title, display, details, html);
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
        try {
            // Loop through each issue and then...
            // Set the issue to fixed...
            // Resolve the promise
            resolve();
        } catch (e) {
            issueItem.issues[0].status = 'untouched';
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'item_settings',
    title: 'Item Settings',
    description: 'This tool allows your to edit a Canvas item\'s settings.',
    icon: 'settings',
    toolType: 'fix',
    toolCategory: 'itemSettings',
    fixMessage: 'Describe the result of an item being fixed here',
    categories: [
        'pages',
        'assignments',
        'quizzes',
    ],
    discoverOptions: [{
        title: 'Conditions',
        key: 'selectedSettings',
        description: 'Select the item properties you would like to modify.',
        type: 'multiselect',
        choices: ['title', 'published', 'editing_roles', 'description'],
        required: true
    }],
    fixOptions: [{
        title: 'Placeholder',
        key: 'Placeholder',
        description: 'Placeholder',
        type: 'dropdown',
        choices: ['Placeholder'],
        required: true
    }],
    editorTabs: [{
        title: 'HTML',
        htmlKey: 'currentHtml',
        readOnly: true
    }]
};
