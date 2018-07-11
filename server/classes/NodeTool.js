const IssueItem = require('./IssueItem.js');
const canvas = require('canvas-api-wrapper');

module.exports = class NodeTool {

    constructor(details) {
        this._discover = details.discover;
        this._fix = details.fix;
        this.id = details.id;
        this.title = details.title;
        this.description = details.description;
        this.icon = details.icon;
        this.categories = details.categories;
        this.toolCategory = details.toolCategory;
        this.discoverOptions = details.discoverOptions;
        this.fixOptions = details.fixOptions;
        this.lastRan = null;
    }

    discover(canvasItem, options) {
        // Create the IssueItem for this canvas item
        let issueItem = new IssueItem(canvasItem);
        try {
            this.lastRan = new Date();

            // Run the item through the discover function
            this._discover(canvasItem, issueItem, options);

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