const d3 = require('d3-dsv');
const fs = require('fs');

function serverLogger(logs) {
    var csvLog = '';
    // Check if the log file already exists
    fs.access('./server/logs/server_log.csv', fs.constants.F_OK | fs.constants.W_OK, (doesNotExist) => {
        if (doesNotExist) { 
            // Make the log with the header
            csvLog = d3.csvFormatRows([[
                "Date",
                "Start Time",
                "End Time",
                "Action",
                "Tool",
                "Mode",
                "Course ID"
            ]].concat(logs.map(log => {
                return [
                    log.date,
                    log.startTime,
                    log.endTime,
                    log.action,
                    log.details.tool,
                    log.details.mode,
                    log.details.courseId
                ];
            }))) + '\n';
        } else {
            // Make the log without the header
            csvLog = d3.csvFormatRows(logs.map(log => {
                return [
                    log.date,
                    log.startTime,
                    log.endTime,
                    log.action,
                    log.details.tool,
                    log.details.mode,
                    log.details.courseId
                ];
            })) + '\n';
        }
        // Append the newly logged items to the existing file
        fs.appendFile(`./server/logs/server_log.csv`, csvLog, err => {
            if (err) {
                console.error(err);
            }
        });
    });
}

function toolLogger(logs) {
    var csvLog = '';
    // Check if the log file already exists
    fs.access('./server/logs/tools_log.csv', fs.constants.F_OK | fs.constants.W_OK, (doesNotExist) => {
        if (doesNotExist) { 
            // Make the log with the header
            csvLog = d3.csvFormatRows([[
                "Title",
                "Course ID",
                "Item ID",
                "Category",
                "Link",
                "Issues",
            ]].concat(logs.map(log => {
                var flatIssues = log.issues.reduce((acc, issue) => acc.concat(JSON.stringify(issue)), []);
                return [
                    log.title,
                    log.course_id,
                    log.item_id,
                    log.category,
                    log.link,
                    ...flatIssues,
                ];
            })));
        } else {
            // Make the log without the header
            csvLog = d3.csvFormatRows(logs.map(log => {
                var flatIssues = log.issues.reduce((acc, issue) => acc.concat(JSON.stringify(issue)), []);
                return [
                    log.title,
                    log.course_id,
                    log.item_id,
                    log.category,
                    log.link,
                    ...flatIssues
                ];
            })) + '\n';
        }
        // Append the newly logged items to the existing file
        fs.appendFile(`./server/logs/tools_log.csv`, csvLog, err => {
            if (err) {
                console.error(err);
            }
        });
    });
}

// A temporary location to put the logs before they are written to the output file
module.exports.serverLogs = [];
module.exports.toolLogs = [];

// Send the logs to their designated functions to write them to their files, then set the log arrays to be empty
module.exports.logTool = () => {
    toolLogger(module.exports.toolLogs);
    module.exports.toolLogs = [];
}

module.exports.logServer = () => {
    serverLogger(module.exports.serverLogs);
    module.exports.serverLogs = [];
}