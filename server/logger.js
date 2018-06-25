const fs = require('fs');

function makeReadable(data) {
    /* Expected format for logs: {
        action: <node_tool, report, search, etc>,
        details: <things specific to the action
    } */
    // <DATE> ACTION | MODE:discovery TOOL:tool_id COURSES:1234,523342,6456324,12342643,6345345

    return Object.keys(data).reduce((acc, key) => {
        let value = data[key];
        if (data[key] instanceof Object) {
            value = data[key].toString();
        }
        return acc + ` ${key.toUpperCase()}:${value}`;

    }, `${new Date()} ${data.action.toUpperCase()} |`);
}

module.exports = (data) => {
    try {
        let logPath = './logs/logs.txt';
        fs.appendFileSync(logPath, makeReadable(data));
    } catch (e) {
        console.error(e);
    }
}