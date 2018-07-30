const cheerio = require('cheerio');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/

// This needs to be re-written so that Items with only 1 OL do not get discovered
function discover(canvasItem, issueItem, options) {
    if (canvasItem.getHtml() === null) return;
    let $ = cheerio.load(canvasItem.getHtml());
    let ols = $('ol').get();
    let types = {
        0: '1',
        1: 'a',
        2: 'i'
    };

    function getChildren(ol, olsToFix, oldTypes, newTypes, i) {
        if (i > 2) i = 0;
        oldTypes.push($(ol).attr('type') ? 'type' : 'Not Defined');
        newTypes.push(types[i]);
        olsToFix.push({
            type: types[i],
            ol: ol
        });
        i++;
        ol.children.forEach(child => {
            if (child.name === 'ol') {
                getChildren(child, olsToFix, oldTypes, newTypes, i);
            } else if (child.name === 'li') {
                child.children.forEach(item => {
                    if (item.name === 'ol') {
                        getChildren(item, olsToFix, oldTypes, newTypes, i);
                    }
                });
            }
        });
    }

    function getNewOl(olsToFix, newTypes) {
        olsToFix.forEach((olToFix, i) => {
            $(olToFix.ol).attr('type', newTypes[i]);
        });
        return olsToFix[0].ol;
    }

    /* If there aren't any ordered lists in the item then return */
    if (ols.length === 0) return;
    ols.forEach(ol => {
        if (ol.parent.name !== 'ol' && ol.parent.name !== 'li') {
            let attribute = $(ol).attr('type') ? 'type' : 'N/A';
            let olsToFix = [];
            let oldTypes = [];
            let newTypes = [];
            let oldOl = new String($(ol).html());
            let html = {
                currentHtml: canvasItem.getHtml()
            };
            let newOl;

            //Get the parents Children

            getChildren(ol, olsToFix, oldTypes, newTypes, 0);

            // Check if the OL has an ordered list(s) as a child, if it does add an issue item, else do not.
            if (olsToFix.length > 1) {
                newOl = new String($(getNewOl(olsToFix, newTypes)).html());
                let title = 'Ordered List Type Incorrect';
                let display = `
                <div>This ordered list doesn't contain the correct type. This will update it so it has the correct type.</div>
                <h3>current ordered list</h3>
                    <div class="code-block">
                    <ol>${oldOl}</ol>
                    </div>
                <h3>updated ordered list</h3>
                    <div class="code-block">
                    <ol type="1">${newOl}</ol>
                    </div>
                `;

                html.currentOl = `<ol>${oldOl}</ol>`;
                html.updatedOl = `<ol type="1">${newOl}</ol>`;
                html.updatedHTML = new String($.html());
                let details = {
                    tag: ol.tagName,
                    attribute,
                    oldTypes,
                    newTypes
                };
                issueItem.newIssue(title, display, details, html);
            }
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
            issueItem.issues.forEach(issue => {
                if (issue.status === 'approved') {
                    console.log(issueItem.issues[0].html);
                }
            });
            resolve();
        } catch (e) {
            issueItem.issues[0].status = 'failed';
            reject(e);
        }
    });
    // try {
    //     let $ = cheerio.load(canvasItem.getHtml());
    //     issueItem.issues.forEach(issue => {
    //         if (issue.status === 'approved') {
    //             let link = $(`${issue.details.tag}[${issue.details.attribute}="${issue.details.oldUrl}"]`).first();
    //             if (link) {
    //                 let newUrl = $(link).attr(issue.details.attribute);
    //                 newUrl = newUrl.replace(/\/file\//i, '/integ/gen/');
    //                 newUrl = newUrl.replace(/\/\d+\//i, '/0/');
    //                 $(link).attr(issue.details.attribute, newUrl);
    //             }
    //             issue.status = 'fixed';
    //         }
    //     });
    //     canvasItem.setHtml($.html());
    //     await canvasItem.update();
    //     resolve();
    // } catch (e) {
    //     issueItem.issues[0].status = 'failed';
    //     reject(e);
    // }

}

module.exports = {
    discover,
    fix,
    id: 'bullet_point_formatter',
    title: 'Update Ordered Lists',
    description: 'Fixes the styling of ordered lists.',
    icon: 'list',
    toolType: 'fix',
    toolCategory: 'html',
    fixedMessage: 'Ordered List Updated',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes',
        'quizQuestions'
    ],
    discoverOptions: [],
    fixOptions: [],
    editorTabs: [{
        title: 'Current Ordered List',
        htmlKey: 'currentOl',
        readOnly: true
    }, {
        title: 'Updated Ordered List',
        htmlKey: 'updatedOl',
        readOnly: true
    }, {
        title: 'Updated HTML',
        htmlKey: 'updatedHTML',
        readOnly: true
    }]
};
