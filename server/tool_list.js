const NodeTool = require('./classes/NodeTool.js');

module.exports = {
    // 'rename_pages': new NodeTool(require('./node_tools/rename_pages.js')),
    // 'course_search': new NodeTool(require('./node_tools/course_search.js')),
    // 'equella_links': new NodeTool(require('./node_tools/equella_links.js')),
    'alt_attributes': new NodeTool(require('./node_tools/alt_attributes.js')),
    'byui_style_classes': new NodeTool(require('./node_tools/byui_style_classes.js')),
    'discussions_threaded': new NodeTool(require('./node_tools/discussions_threaded.js')),
    'course_search': new NodeTool(require('./node_tools/course_search.js')),
    // 'broken_images': new NodeTool(require('./node_tools/broken_images.js')),
};