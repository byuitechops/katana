# Katana

This tool is built to interface with Canvas, a Learning Management System built by Instructure. It provides the framework for a development team to build and deploy mass-maintenance tools. It *is not* build by Instructure. It was built by Brigham Young University - Idaho, and is maintained by them.

## Setup

To set up your own instance of Katana, follow these steps:

1. Install and [use git](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) to clone the repository

2. [Install NodeJS](https://nodejs.org/en/download/) if is not installed

3. In the terminal, run: `npm install`

4. After step 3 is complete...

5. (Firestore auth file)

6. (Canvas developer key)

7. Run `ng build --prod` to build the production files

8. Retrieve the production files from `/dist` and deploy them from a server however you would like

## Development

For development, use this command to build the angular front-end and launch the server immediately after:

```npm run fullbuild```

It can then be accessed via `localhost:8000` (or whichever port you specify in `server/settings.json`).

**Flags**

| Flag      | Purpose                                                   |
|-----------|-----------------------------------------------------------|
| --mute    | Prevents database logging from appearing in the console   |


# Documentation

## Client (Angular)
<!-- This will need to point to Compodocs when it is set up -->
[LinkName](link) 

## Architecture
[LinkName](link)<br />

## How To...
[LinkName](link)<br />

## Firebase Integration
[LinkName](link)<br />







