const firebaseWrapper = require('./firebase_wrapper.js');
const {admin} = firebaseWrapper;

module.exports = (req, res, next) => {

    // If they did not include a user token, fail it
    if (!req.query.userIdToken) {
        res.status(401).send('Failed Authentication');
        console.log('Failed Authentication (ID Token not included)');
    } else {
        // Checks if the user's token is valid and has not been revoked
        admin.auth().verifyIdToken(req.query.userIdToken, true)
            .then(function (decodedToken) {
                // If it reaches this point, the user is good to go
                // Attach user's email if available
                if (req.body) {
                    req.body.userEmail = decodedToken.email;
                }
                return next();
            }).catch(function (error) {
                res.status(401).send('Failed Authentication');
                firebaseWrapper.serverLog({
                    'message': 'Failed Authentication',
                    'body': JSON.stringify(req.body)
                });
                console.error(error);
                next();
            });
    }

};