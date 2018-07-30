# Setting Up Firebase

Katana uses three of Firebase's features: Authentication, Database (firestore), and Functions. This will guide you through settings up all three on a brand new instance. If you already have an instance set up, but need to set up your instance's Firebase service account key, you'll just need to generate a new private key.

## Firebase Authentication

In order for the server to be able to authenticate each request that is sent to it (i.e. to run a tool), it needs to have access to a "Service Account." This is essentially a developer key, but for firebase. It just allows an application to act as an admin on Firebase without an actual account.

### Generate Private Key

To create the key for the service account:

1. Go to the [Firebase Console](https://console.firebase.google.com) and navigate to the Katana project
2. Click the "Settings" icon next to the "Project Overview" button at the top left
3. Select "Project Settings"
4. Select the "Service accounts" tab
5. Make sure "Firebase Admin SDK" is selected, and that "Node.js" is selected as the Admin SDK configuration snippet
6. Click "Generate new private key" at the bottom (this will download a file)
7. Rename the downloaded file to `auth.json` and move it into the `server` directory in your instance of Katana
8. That's it! Katana's server will now be able to integrate with your instance of Firebase

Integrating Firebase by creating a private key, as described above, will complete the needed steps for setting up authentication, but there are a few things to be aware of. Currently:

- Katana depends entirely on Google accounts. Users cannot create new accounts, use Facebook, or other means to log in.

## Firebase Database

Katana uses [Firestore](https://firebase.google.com/docs/firestore/). It is a NoSQL database, similiar to Firebase Database, but with greater functionality. It is currently used just to store logs.

Follow [Firebase's Instructions](https://firebase.google.com/docs/firestore/quickstart) to set up your instance of Firestore. After that, you will need to create these collections:

- `server_logs`
- `statistics`
- `tool_logs`
- `user_logs`

These are identified by name by Katana, so having these names match exactly is important. Additional collections can be added as needed - they won't interfere.

## Firebase Functions

Firebase Functions is a feature that allows you to deploy event listeners that fire on certain database actions. It is entirely backend. Currently, its only purpose is to verify that the user is using a Google BYUI account ("@byui.edu"). This can be adjusted for any instance, or entirely excluded. 

Deploying Firebase Functions is very simple. The instructions can be found [here](https://firebase.google.com/docs/functions/get-started).

You may need to create a git repository or a submodule. I would recommend a submodule (which is currently not being used, ironically).