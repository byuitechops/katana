import KatanaCategoryItem from '../../categoryItem/categoryItem.mjs';

export var categories = [{
    title: 'Pages',
    tools: [],
    icon: 'content_copy'
}, {
    title: 'Files',
    tools: [],
    icon: 'folder'
}, {
    title: 'Discussions',
    tools: [],
    icon: 'forum'
}, {
    title: 'Assignments',
    tools: [],
    icon: 'content_copy'
}, {
    title: 'Quizzes',
    tools: [],
    icon: 'content_paste'
}, {
    title: 'Quiz Questions',
    tools: [],
    icon: 'sort'
}, {
    title: 'Modules',
    tools: [],
    icon: 'dns'
}, {
    title: 'Module Items',
    tools: [],
    icon: 'view_list'
}, {
    title: 'Course Settings',
    tools: [],
    icon: 'settings'
}];

export default function getCategories() {
    var categoryElements = categories.map(category => new KatanaCategoryItem(category.title, category.icon));
    console.log(categoryElements);
    var categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    categoryElements.forEach(el => categoryContainer.appendChild(el));
    return categoryContainer;
}