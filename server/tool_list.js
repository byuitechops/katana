const NodeTool = require('./classes/NodeTool.js');

module.exports = {
    // 'rename_pages': new NodeTool(require('./node_tools/rename_pages.js')),
    // 'course_search': new NodeTool(require('./node_tools/course_search.js')),
    // 'equella_links': new NodeTool(require('./node_tools/equella_links.js')),
    // 'course_search': new NodeTool(require('./node_tools/course_search.js')),
    // 'broken_images': new NodeTool(require('./node_tools/broken_images.js')),
    // 'bullet_point_formatter': new NodeTool(require('./node_tools/bullet_point_formatter.js')),
    'alt_attributes': new NodeTool(require('./node_tools/alt_attributes.js')),
    'byui_style_classes': new NodeTool(require('./node_tools/byui_style_classes.js')),
    'discussions_threaded': new NodeTool(require('./node_tools/discussions_threaded.js')),
    'code_blocks': new NodeTool(require('./node_tools/code_blocks.js')),
    'css_classes': new NodeTool(require('./node_tools/css_classes.js')),
    'html_general_editor': new NodeTool(require('./node_tools/html_general_editor.js')),
    // 'link_editor': new NodeTool(require('./node_tools/link_editor.js')),
};
