const fs = require('fs');
const chalk = require('chalk');
const sizeOf = require('object-sizeof');
var db;

function initializeFirebase() {
    const firebaseAdmin = require('firebase-admin');
    try {
        fs.accessSync('./server/auth.json', fs.constants.F_OK);
        var serviceAccount = require('./auth.json');
    } catch (e) {
        throw new Error('FIREBASE AUTH FILE DOES NOT EXIST. EXITING.');
    }
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://katana-24a36.firebaseio.com"
    });
    db = firebaseAdmin.firestore();
    return db;
}

function _log(collectionTitle, data) {
    data.timestamp = new Date();

    if (!process.argv.includes('--mute')) {
        let str = Object.keys(data).reduce((acc, key) => {
            let dataItem = data[key];
            if (typeof data[key] === 'string') {
                dataItem = data[key].length <= 20 ? data[key] : data[key].substr(0, 20) + '...';
            }
            return acc += `${chalk.cyanBright(key.toUpperCase())}:${dataItem} `;
        }, `${chalk.greenBright('FIRESTORE')} ${chalk.green(collectionTitle)} | `);
    }

    // Check to see if string is larger than 1 MB
    let size = sizeOf(data);
    if (sizeOf(data) > 1000000) {
        let divisor = Math.ceil(size / 1000000);
        let count = 0;
        for (let i = 1; i < divisor; i++) {
            let chunk = 0;
            let chunkedData = Object.assign({}, data);
            chunkedData.issueItems = [];
            while (count < data.issueItems.length && chunk + Buffer.byteLength(data.issueItems[count]) < 1000000) {
                chunk += Buffer.byteLength(data.issueItems[count]);
                chunkedData.issueItems.push(data.issueItems[count]);
                ++count;
            }
            db.collection(collectionTitle).add(chunkedData);
        }
    } else {
        db.collection(collectionTitle).add(data);
    }

}

function serverLog(data) {
    _log('server_logs', data);
}

function toolLog(data) {
    _log('tool_logs', data);
}

function userLog(data) {
    _log('user_logs', data);
}

module.exports = {
    initializeFirebase,
    serverLog,
    toolLog,
    userLog,
    db
}