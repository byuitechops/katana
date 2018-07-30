# Firebase Wrapper

The Firebase Wrapper, which is built specifically for Katana, is a small, easy wrapper used to log actions to Firestore. It does nothing more.

**<a target="_blank" href="https://github.com/byuitechops/katana/blob/master/server/firebase_wrapper.js">View firebase_wrapper.js on Github</a>**

## Setup

If you use this separately from Katana, which it is not built for, the structure of your database will need to match what is described in [Database Structure](./database-structure.html). It also requires the [firebase-admin](https://www.npmjs.com/package/firebase-admin) package to properly run. To implement the wrapper in your code:

```javascript
const firebaseWrapper = require('./firebase_wrapper.js');
const db = firebaseWrapper.initializeFirebase();
```
<br />
From there on, `db` can be used to access all of [Firestore's API](https://firebase.google.com/docs/reference/js/firebase.firestore).
<br />


## Functions
These public functions are exposed by the wrapper's export:

|Method|Parameters|Returns|Description|
|------|----------|-------|-----------|
|serverLog(data)|**data** (*object*)|*void*|This saves **data** to the *server_logs* collection in Firestore, such as when a specific API is being tracked.|
|toolLog(data)|**data** (*object*)|*void*|This saves **data** to the *tool_logs* collection in Firestore. Typically used for when tools are being ran.|
|userLog(data)|**data** (*object*)|*void*|This saves **data** to the *tool_logs* collection in Firestore. Typically logs when users log in and out. *Please note that this only logs the user's email and information pertinent to the action that occurred. No other user information is stored.*|
|initializeFirebase()|*none*|[Database Reference](https://firebase.google.com/docs/reference/js/firebase.firestore)|Initializes the app and returns a reference to the database. The database reference is also used internally, so **this function must be called before using any other external functions.** This will also console log any database logging if the `--db` flag was given at startup. It will log *all* information provided to log, which can be quite long. It is not recommended that you use this flag. It is available for development purposes.|
|incrementCounts(category, statistic, count)|**category** {*string*} **statistic** {*string*} **count** {*number*}|void|Used to increment counts saved under `statistics` in Firestore.|

One private function is used internally:

|Method|Parameters|Returns|Description|
|------|----------|-------|-----------|
|_log(collectionTitle, data)|**collectionTitle**(*string*)<br />**data** (*object*)|*void*|Used by the logging functions available externally, this just logs data to Firestore. The other functions are just wrappers for this internal function.
