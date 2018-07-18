const firebaseWrapper = require('./firebase_wrapper.js');
const {admin} = firebaseWrapper;

module.exports = (req, res, next) => {

    // If they did not include a user token, fail it
    if (!req.body.userIdToken) {
        res.status(401);
        res.send('Failed Authentication');
        return;
    }

    // Checks if the user's token is valid and has not been revoked
    admin.auth().verifyIdToken(req.body.userIdToken, true)
        .then(function (decodedToken) {
            next();
        }).catch(function (error) {
            res.status(401);
            res.send('Failed Authentication');

            firebaseWrapper.serverLog({
                'message': 'Failed Authentication',
                'body': JSON.stringify(req.body)
            });

            console.error(error);
        });
}