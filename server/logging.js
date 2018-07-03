/* Dependencies */
const d3 = require('d3-dsv');
const fs = require('fs');

// Log server actions
function serverLogger(logs) {
    var csvLog = '';
    // Check if the log file already exists
    if (!fs.existsSync('./server/logs/server_log.csv')) {
        // Make the log with the header
        csvLog = d3.csvFormatRows([[
            "Date",
            "Start Time",
            "End Time",
            "Action",
            "Tool",
            "Mode",
            "Course ID",
            "Employee Email"
        ]].concat(logs.map(log => {
            return [
                log.date,
                log.startTime,
                log.endTime,
                log.action,
                log.details.tool,
                log.details.mode,
                log.details.courseId,
                log.details.employeeEmail
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
                log.details.courseId,
                log.details.employeeEmail
            ];
        })) + '\n';
    }
    // var filename = '';
    // if (fs.statSync(filename).size >= 1500000000) {
    //     var date = new Date();
    //     filename = `./server/logs/${date}_server_log.csv`;
    // }
    // Append the newly logged items to the existing file
    fs.appendFileSync(`./server/logs/server_log.csv`, csvLog);
}

// Log each tools' actions. The logs being passed in are Issue Items and each of their Issues are then passed into tool_log.csv
function toolLogger(logs) {
    var csvLog = '';

    logs.forEach(log => {
        // Check if the log file already exists
        if (!fs.existsSync('./server/logs/tools_log.csv')) {
            // Make the log with the header
            csvLog = d3.csvFormatRows([[
                "Tool",
                "Issue Title",
                "Status",
                "Option Values",
                "Item Title",
                "Item ID",
                "Course ID",
                "Category",
                "Link",
                "Details",
            ]].concat(log.issues.map(issue => {
                var flatIssueDetails = Object.entries(issue.details).reduce((acc, pair) => {
                    var detail = `${pair[0]}: ${pair[1]}`;
                    return acc.concat(detail);
                }, []);

                return [
                    issue.tool_id,
                    issue.title,
                    issue.status,
                    issue.optionValues ? issue.optionValues : '',
                    log.title,
                    log.item_id,
                    log.course_id,
                    log.category,
                    log.link,
                    ...flatIssueDetails
                ];
            }))) + '\n';
        } else {
            // Make the log without the header
            csvLog = d3.csvFormatRows(log.issues.map(issue => {
                var flatIssueDetails = Object.entries(issue.details).reduce((acc, pair) => {
                    var detail = `${pair[0]}: ${pair[1]}`;
                    return acc.concat(detail);
                }, []);

                return [
                    issue.tool_id,
                    issue.title,
                    issue.status,
                    issue.optionValues ? issue.optionValues : '',
                    log.title,
                    log.item_id,
                    log.course_id,
                    log.category,
                    log.link,
                    ...flatIssueDetails
                ];
            })) + '\n';
        }

        // Append the newly logged items to the existing file
        fs.appendFileSync(`./server/logs/tools_log.csv`, csvLog);
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