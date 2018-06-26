const d3 = require('d3-dsv');
const fs = require('fs');

module.exports = (logs) => {
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
};

module.exports.tempLogs = [];

module.exports.logSaved = () => {
    module.exports(module.exports.tempLogs);
    module.exports.tempLogs = [];
}