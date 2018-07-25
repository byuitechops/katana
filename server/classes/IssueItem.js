var categories = {
    'Assignment': 'assignments',
    'Page': 'pages',
    'Quiz': 'quizzes',
    'Question': 'quizQuestions',
    'Module': 'modules',
    'ModuleItem': 'moduleItems',
    'Discussion': 'discussions',
    'File': 'files',
    'Folder': 'folders'
};

module.exports = class IssueItem {
    constructor(item) {
        this.title = item.getTitle();
        this.course_id = item.getParentIds()[0];
        this.parent_id = item.getParentIds().slice(-1)[0];
        this.item_id = item.getId();
        this.item_path = item.getPath();
        this.category = categories[item.constructor.name];
        this.link = item.getUrl();
        this.issues = [];
    }

    newIssue(title, display, details = {}, html = {}) {
        this.issues.push({
            title,
            details,
            html,
            display,
            status: 'untouched'
        });
    }
};