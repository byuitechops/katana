# Katana

If you are on Github, it is recommended you view the full documentation [HERE](https://byuitechops.github.io/katana/docs/index.html).

This tool is built to interface with Canvas, a Learning Management System built by Instructure. It provides the framework for a development team to build and deploy mass-maintenance tools. It *is not* built by Instructure. It was built by Brigham Young University - Idaho, and is maintained by them.

## Setup - Production

To set up your own instance of Katana, follow these steps:

1. Install Git and [use it to clone](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) the repository

2. [Install NodeJS](https://nodejs.org/en/download/) if is not installed

3. In the terminal, run: `npm install`

4. (TEMP: Set up CANVAS_API_TOKEN environment variable | Will become canvas developer key)

5. Deploy Firebase using the steps described in [this document](https://byuitechops.github.io/katana/docs/additional-documentation/setup/setting-up-firebase.html)

6. Build production files with `ng build --prod`

<!-- 7. Copy the `server` directory and the contents of the `/dist` folder into the directory you will be deploying from -->

7. In the terminal, run: `npm start` to start `server.js` (which will start Katana on port 8000)

8. Follow any [additional setup processes](https://byuitechops.github.io/katana/docs/additional-documentation/setup.html) you need

We **strongly recommend** that you also install our **[Canvas Course Exporter](https://github.com/byuitechops/canvas-course-exporter)** tool as well, so that anything that doesn't go according to plan in your Katana development can be fixed with a backed-up course.

## Development

For development, use the following commands:

```npm run fullbuild``` to build the angular front-end and launch the server immediately after

```npm start``` to launch the server if the angular front-end is already built

```npm run docs``` to run **[Compodocs](https://compodoc.app/)** on your Katana Project

```npm run insFullbuild``` to build the angular front-end and launch the server with the `--inspect-brk` flag

Once the angular front-end is built and the server is running, Katana can then be accessed via `localhost:8000` (or whichever port you specify in `server/settings.json`).

You can also deploy it for others to use by using your IP Address and your port number. So if you were running on `port 8000` and your IP Address was `10.1.182.255` then you could deploy it on your network with the url `10.1.182.255:8000`, though hosting it on a server with a url for your users to access would of course be better.

# Documentation

### Additional Setup
[Set up a Node Tool](https://byuitechops.github.io/katana/docs/additional-documentation/setup/node-tools.html)<br />
[Set up Firebase](https://byuitechops.github.io/katana/docs/additional-documentation/setup/setting-up-firebase.html)<br />
[Enabling Accounts on Firebase](https://byuitechops.github.io/katana/docs/additional-documentation/setup/enabling-accounts-on-firebase.html)<br />

### Client Architecture (Angular)
[Angular Structure Documentation](https://byuitechops.github.io/katana/docs/index.html) 

### Server Architecture (Express)
[LinkName](https://byuitechops.github.io/katana/docs/additional-documentation/architecture.html)<br />








