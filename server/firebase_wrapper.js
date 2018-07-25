const fs = require('fs');
const chalk = require('chalk');
const sizeOf = require('object-sizeof');
const admin = require('firebase-admin');
const settings = require('./settings.json');
var db;

function initializeFirebase() {
    try {
        fs.accessSync('./server/auth.json', fs.constants.F_OK);
        var serviceAccount = require('./auth.json');
    } catch (e) {
        throw new Error('FIREBASE AUTH FILE DOES NOT EXIST. EXITING.');
    }
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://katana-24a36.firebaseio.com'
    });

    // The instance of firestore database
    db = admin.firestore();

    // Backwards compatability with Firestore's new timestamp storage rules
    admin.firestore().settings({timestampsInSnapshots: true});

    return db;
}

function _log(collectionTitle, data) {
    data.timestamp = new Date();

    // Based on settings, console logs what's being logged in the database
    if (settings.console['database-actions'] === true) {
        let str = Object.keys(data).reduce((acc, key) => {
            let dataItem = data[key];
            if (typeof data[key] === 'string') {
                dataItem = data[key].length <= 20 ? data[key] : data[key].substr(0, 20) + '...';
            }
            return acc += `${chalk.cyanBright(key.toUpperCase())}:${dataItem} `;
        }, `${chalk.greenBright('FIRESTORE')} ${chalk.green(collectionTitle)} | `);
        console.log(str);
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

function incrementCounts(category, statistic, count) {
    // get the current count
    let docRef = db.collection('statistics').doc(category);
    docRef.get()
        .then(doc => {
            if (doc) {
                // up the current count
                let newStat = {[statistic]: doc.data()[statistic] + count};
                docRef.update(newStat);
            }
        })
        .catch(console.error);
}

module.exports = {
    initializeFirebase,
    serverLog,
    toolLog,
    userLog,
    incrementCounts,
    db,
    admin
};
