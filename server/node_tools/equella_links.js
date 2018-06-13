const cheerio = require('cheerio');

/*****************************************************************
 * Discovers issues in the item provided.
 * @param {object} canvasItem - Canvas item produced by the Canvas API Wrapper
 * @param {IssueItem} issueItem - The IssueItem for the item, without any issues
 * @param {object} options - Options specific to the tool selected by the user
 * @returns {IssueItem} - The item in IssueItem format 
 *****************************************************************/
function discover(canvasItem, issueItem, options) {

    if (canvasItem.getHtml() === null) return;

    var $ = cheerio.load(canvasItem.getHtml());
    var links = $('a').get();

    /* If there aren't any links in the item then return */
    if (links.length === 0) return;

    links.forEach(link => {

        /* Assign the oldUrl name for logging purposes */
        if (!$(link).attr('href')) {
            return;
        }

        var oldUrl = $(link).attr('href');

        var keywords = options.excludeKeywords.replace(/\s/g, '');
        if (keywords && keywords.split(',').some(keyword => oldUrl.includes(keyword))) {
            return;
        }

        /* Check if the link has an href, and if it is already the correct href */
        if ($(link).attr('href').includes('content.byui.edu/file/') &&
            !$(link).attr('href').includes('content.byui.edu/integ/gen/')) {
            var newUrl = $(link).attr('href');
            newUrl = newUrl.replace(/\/file\//i, '/integ/gen/');
            newUrl = newUrl.replace(/\/\d+\//i, '/0/');

            let title = 'Static Equella Link in HTML';
            let display = `
            <div style="margin-bottom: 10px">This item contains an equella link that points to a specific version. This will update it so it always uses the latest version.</div>
            <div class="pad-10">
                <p><div style="display:inline-block;min-width:100px;"><strong>Original URL:</strong></div> ${oldUrl}</p>
                <p><div style="display:inline-block;min-width:100px;"><strong>Updated URL:</strong></div> ${newUrl}</p>
            </div>
            `;
            let details = {
                oldUrl,
                newUrl
            };

            issueItem.newIssue(title, display, details);
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
            var $ = cheerio.load(canvasItem.getHtml());

            issueItem.issues.forEach(issue => {
                if (issue.status === 'approved') {
                    let link = $(`a[href="${issue.details.oldUrl}"]`).first();
                    if (link) {
                        let newUrl = $(link).attr('href');
                        newUrl = newUrl.replace(/\/file\//i, '/integ/gen/');
                        newUrl = newUrl.replace(/\/\d+\//i, '/0/');
                        $(link).attr('href', newUrl);
                    }
                    issue.status = 'fixed';
                }
            });

            canvasItem.setHtml($.html());
            await canvasItem.update();
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
    id: 'equella_links',
    title: 'Update Equella Links',
    description: 'This tool will identify Equella links that are statically set to use a single version of the Equella item. With approval, it will change these links to use the dynamic format.',
    icon: 'link',
    categories: [
        'pages',
        'assignments',
        'discussions',
        'quizzes'
    ],
    discoverOptions: [{
        title: 'Exclusions',
        key: 'excludeKeywords',
        description: 'List key words separated by commas for equella links you would like to skip. If the key word is in the equella URL, the URL will not be affected.',
        type: 'text',
        choices: [],
        required: false
    }],
    fixOptions: [],
};
