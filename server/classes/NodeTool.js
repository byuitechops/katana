const ItemCard = require('./ItemCard.js');
const canvas = require('canvas-api-wrapper');
const cheerio = require('cheerio');

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
        this.categories = details.categories.filter(category => category !== 'quizQuestions');
        this.discoverOptions = details.discoverOptions || [];
        this.fixOptions = details.fixOptions || [];
        this.editorTabs = details.editorTabs || [];
        this.enableApproveAll = details.enableApproveAll || null;
        this.lastRan = null;
    }

    async discover(canvasItem, options) {
    // Create the ItemCard for this canvas item
        let itemCard = new ItemCard(canvasItem);
        try {
            this.lastRan = new Date();

            // Run the item through the discover function
            await this._discover(canvasItem, itemCard, options);

            // Strip off Canvas's script and link tags, as well as the html and head tags put on by Cheerio
            itemCard.issues.forEach(issue => {
                if (issue.html && Object.keys(issue.html).length > 0) {
                    Object.keys(issue.html).forEach(key => {
                        if (issue.html[key] !== undefined && issue.html[key] !== null) {
                            let $ = cheerio.load(issue.html[key])
                            let tags = $('link').add('script');
                            tags.each((i, tag) => {
                                // if the src or the href have 'amazonaws' in them, take it out
                                if (($(tag).attr('src') && $(tag).attr('src').includes('amazonaws')) || ($(tag).attr('href') && $(tag).attr('href').includes('amazonaws'))) {
                                    $(tag).remove();
                                }
                            });
                            issue.html[key] = $('body').html();
                        }
                    });
                }
            });

            return itemCard;
        } catch (e) {
            console.error(e);
            return itemCard;
        }
    }

    fix(itemCard, options) {
        this.lastRan = new Date();
        return new Promise(async (resolve, reject) => {
            try {

                // If there aren't any approved issues, nothing to do
                if (itemCard.issues.every(issue => issue.status !== 'approved')) {
                    return resolve();
                }

                // Checks to see if the fix function was included in the module.exports in the tool
                if (this._fix === null) {
                    console.log('This tool has no fix method included in the exported settings object');
                    return resolve();
                }

                if (!itemCard.category) {
                    console.log('This itemCard does not have a category attached', itemCard);
                    return resolve();
                }

                // Retrieves the item in Canvas
                let canvasCourse = canvas.getCourse(itemCard.course_id);

                // if question or moduleitem treat it special, like dinner or something
                let canvasItem;
                let parent;
                if (['quizQuestions', 'moduleItems'].includes(itemCard.category)) {
                    if (itemCard.category === 'quizQuestions') {
                        parent = await canvasCourse.quizzes.getOne(itemCard.parent_id);
                        canvasItem = await parent.questions.getOne(itemCard.item_id);
                    } else {
                        parent = await canvasCourse.modules.getOne(itemCard.parent_id);
                        canvasItem = await parent.moduleItems.getOne(itemCard.item_id);
                    }
                } else {
                    parent = canvasCourse[itemCard.category];
                    canvasItem = await parent.getOne(itemCard.item_id);
                }

                // Create new array of all issues
                let allIssues = itemCard.issues.slice();

                // Filter down to just approved issues
                itemCard.issues = itemCard.issues.filter(issue => issue.status === 'approved');

                // Runs the item and itemCard through the fix function
                this._fix(canvasItem, itemCard, options);

                // Put all issues back onto the itemCard (since they are objects, any changes to the
                // issues inside the fix function will be applied to the issues in allIssues)
                itemCard.issues = allIssues;

                // Updates the item in Canvas
                await canvasItem.update();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

};
