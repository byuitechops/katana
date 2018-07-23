const IssueItem = require('./IssueItem.js');
const canvas = require('canvas-api-wrapper');

module.exports = class NodeTool {

    constructor(details) {
        this._discover = details.discover;
        this._fix = details.fix || null;
        this.id = details.id;
        this.title = details.title;
        this.description = details.description;
        this.icon = details.icon;
        this.toolType = details.toolType;
        this.toolCategory = details.toolCategory;
        this.fixMessage = details.fixMessage;
        this.categories = details.categories;
        this.discoverOptions = details.discoverOptions || [];
        this.fixOptions = details.fixOptions || [];
        this.editorTabs = details.editorTabs || [];
        this.lastRan = null;
    }

    discover(canvasItem, options) {
    // Create the IssueItem for this canvas item
        let issueItem = new IssueItem(canvasItem);
        try {
            this.lastRan = new Date();

            // Run the item through the discover function
            this._discover(canvasItem, issueItem, options);

            // Strip off Canvas's script and link tags
            issueItem.issues.forEach(issue => {
                if (issue.html !== {}) {
                    Object.keys(issue.html).forEach(key => {
                        issue.html[key] = issue.html[key].replace(/((<link rel)|(<script src))=".*amazonaws.*((.css")|(script))>/g, '');
                    });
                }
            });

            return issueItem;
        } catch (e) {
            console.error(e);
            return issueItem;
        }
    }

    fix(issueItem, options) {
        this.lastRan = new Date();
        return new Promise(async (resolve, reject) => {
            try {
                // Checks to see if the fix function was included in the module.exports in the tool
                if (this._fix === null) {
                    console.log('This tool has no fix method included in the exported settings object');
                    return resolve();
                }

                if (!issueItem.category) {
                    console.log('This issueItem does not have an category attached', issueItem);
                    return resolve();
                }

                // Retrieves the item in Canvas
                let canvasCourse = canvas.getCourse(issueItem.course_id);
                let canvasItem = await canvasCourse[issueItem.category].getOne(issueItem.item_id);

                // Runs the item and issueItem through the fix function
                this._fix(canvasItem, issueItem, options);

                // Updates the item in Canvas
                await canvasItem.update();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

};
