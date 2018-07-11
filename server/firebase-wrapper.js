const fs = require('fs');
const chalk = require('chalk');
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

    db.collection(collectionTitle).add(data);
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