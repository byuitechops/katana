const cheerio = require('cheerio');
const canvas = require('canvas-api-wrapper');

var courseFiles = {};

/** ***************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 *****************************************************************/
async function discover(canvasItem, issueItem, options) {
    if (canvasItem.getHtml() === null) return;
    var $ = cheerio.load(canvasItem.getHtml());
    var images = $('img');

    if (!courseFiles[issueItem.course_id + 'c']) {
        courseFiles[issueItem.course_id + 'c'] = await canvas.get(`/api/v1/courses/${issueItem.course_id}/files?content_types=image`);
        // console.log(courseFiles);
    }
    images.each((i,image) => {
        image = $(image);
        var src = image.attr('src');
        var srcArray = src.split('/');
        srcArray.pop();
        var filename = srcArray[srcArray.length - 1];
        var found = undefined;
        if (filename.includes('.')) {
            found = fileArray.find(file => {
                if (file.filename === filename || file.url.includes(filename)) {
                    return file;
                }
            });
        }
        console.log(src, filename, found)
        
        var newFilePath = '';
        if (found) {
            // newFilePath = `https://byui.instructure.com/courses/${issueItem.course_id}/files/${found.id}/preview`;
            var modifiedUrl = found.url.split('=');
            var verifierNum = modifiedUrl[modifiedUrl.length - 1];
            var pathArray = found.url.split('/');
            newFilePath = pathArray.join('/');
            newFilePath += `preview?verifier=${verifierNum}`;
            // console.log(newFilePath);
        }
        var title = 'Existing File Path';
        var description = 'The file path for this image should match the file location in Canvas';
        var display = `
        <div>${description}</div>
        <h3>Image</h3>
        <div class="navy z-depth-1" style="max-width:100%;border-radius:3px;padding:10px 10px 4px 10px;display:inline-block">
        <img style="max-width:100%" src="${image.attr('src')}">
        </div>
        <h3>Current File Path</h3>
        <div class="code-block">${src}</div>
        `;
        
        if (newFilePath !== '') {
            console.log(`Adding to display for ${issueItem.course_id}, ${issueItem.title}`);
            display += `
            <h3>Suggested File Path</h3>
            <div class="code-block">${newFilePath}</div>
            `;
            var details = {
                image: image.attr('src'), 
                title,
                description
            };
        }
        issueItem.newIssue(title, display, details);
    });
    return;
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
            if (canvasItem.getHtml()) {
                var $ = cheerio.load(canvasItem.getHtml());

                issueItem.issues.forEach(issue => {
                    if (issue.status === 'approved') {

                        let image = $(`img[src="${issue.details.image}"]`).first();
                        if (image && issue.optionValues.newFilePath) {
                            $(image).attr('src', issue.optionValues.newFilePath);
                            issue.status = 'fixed';
                        }

                    }
                });

                canvasItem.setHtml($.html());
                await canvasItem.update();
                resolve();
            }
        } catch (e) {
            issueItem.issues.forEach(issue => {
                if (issue.status === 'approved') {
                    issue.status = 'failed';
                }
            });
            reject(e);
        }
    });
}

module.exports = {
    discover,
    fix,
    id: 'broken_images',
    title: 'Broken Images',
    description: 'This tool allows you to edit image file paths. It currently provides all images in the course and will allow you to change their individual file paths, if desired. Courses with a high number of images may cause delays when navigating through issues. You will NOT be able to see any of the images if you are not signed into Canvas.',
    fixedMessage: 'The image file path has been updated',
    icon: 'image',
    categories: [
        'assignments',
        'discussions',
        // 'pages',
        // 'quizzes',
        // 'quizQuestions'
    ],
    requiredCategories: [
        'files'
    ],
    toolCategory: 'html',
    discoverOptions: [],
    fixOptions: [{
        title: 'New File Path',
        key: 'newFilePath',
        description: 'Please enter the new file path for this image.',
        type: 'text',
        choices: [],
        required: true
    }],
};