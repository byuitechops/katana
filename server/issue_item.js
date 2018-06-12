var categories = {
    'Page': 'pages',
    'Quiz': 'quizzes',
    'QuizQuestion': 'quizQuestions',
    'Module': 'modules',
    'ModuleItem': 'moduleItems',
    'Discussion': 'discussions',
    'File': 'files',
    'Folder': 'folders'
}

/*********************************************************************
 * 
 * 
 * ******************************************************************/
module.exports = class IssueItem {
    constructor(item) {
        this.title = item.getTitle();
        this.course_id = item._course;
        this.item_id = item.getId();
        this.category = categories[item.constructor.name];
        this.link = item.getUrl();
        this.issues = [];
    }

    /*********************************************************************
     * 
     * 
     * ******************************************************************/
    newIssue(title, details) {
        this.issues.push({
            title,
            details,
            status: 'untouched'
        });
    }
}