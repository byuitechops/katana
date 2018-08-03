# Katana

If you are on Github, it is recommended you view the full documentation [HERE](https://byuitechops.github.io/katana/docs/index.html).

This tool is built to interface with Canvas, a Learning Management System built by Instructure. It provides the framework for a development team to build and deploy mass-maintenance tools. It *is not* built by Instructure. It was built by Brigham Young University - Idaho, and is maintained by them.

## Setup

To set up your own instance of Katana, follow these steps:

1. Install Git and [use it to clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) the [Katana repository](https://github.com/byuitechops/katana)

2. [Install NodeJS](https://nodejs.org/en/download/) if is not installed

3. In the terminal, run: `npm install`

4. (TEMP: Set up CANVAS_API_TOKEN environment variable | Will become canvas developer key)

5. Deploy Firebase using the steps described in [this document](./additional-documentation/setup/setting-up-firebase.html)

6. Build production files with `ng build --prod`

7. Copy the `server` directory and the contents of the `/dist` folder into the directory you will be deploying from

8. Run `server.js` with Node however you would like (typically with `npm start`)

9. Follow any [additional setup processes](./additional-documentation/setup.html) you need

## Development

For development, use this command to build the angular front-end and launch the server immediately after:

```npm run fullbuild```

It can then be accessed via `localhost:8000` (or whichever port you specify in `server/settings.json`).

You can also deploy it for others to use by using your IP Address and your port number. So if you were running on `port 8000` and your IP Address was `10.1.182.255` then you could deploy it on your network with the url `10.1.182.255:8000`, though hosting it on a server with a url for your users to access would of course be better.

# Documentation

### Additional Setup
[Set up a Node Tool](additional-documentation/setup/node-tools.html)<br />
[Set up Firebase](additional-documentation/setup/setting-up-firebase.html)<br />
[Enabling Accounts on Firebase](additional-documentation/setup/enabling-accounts-on-firebase.html)<br />

### Client Architecture (Angular)
[Angular Structure Documentation](https://byuitechops.github.io/katana/documentation/index.html) 

### Server Architecture (Express)
[LinkName](./documentation/additional-documentation/architecture.html)<br />








