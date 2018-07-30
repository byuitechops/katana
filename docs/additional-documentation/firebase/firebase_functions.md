## Firebase Functions

Firebase provides a service called **[Firebase Functions](https://firebase.google.com/docs/functions/)** that allows functions to be written that run on key events fired on the database. This is used to control if an account is valid or not when a user signs up. Currently, only one function is deployed to the BYUI instance of Katana.

|Function|Event|Description|
|--------|-----|-----------|
|verifyNewUsers()|functions.auth.user().onCreate(...)|Checks whether or not the user is a BYUI Google account, and if they are not, removes their account immediately. If they are, it disables their account and revokes their refresh tokens (to disable their current session).| 

You must be an admin or owner on your firebase instance to deploy Firebase Functions.