# AcePyodide

## Overview
This is a combination of a few of my projects, involving `pyodide`, `ace editor` and a personal project to create an expandable toolbar.

### Information
- Very little effort, if any, has been put into error catching in `JavaScript`
  - I am aware this will be my downfall, but as a demo project it makes it easier for me to read the code

# Disclaimer
- Any files saved via the cloud save function are publically accessible, do not save any sensitive data, one example of this would be hard-coded `API` keys
- The default user ID is `1336348896317857792`, there are no passwords, data is uploaded in `JSON` format to a `URL` that looks like this `https://jsonblob.com/{ID}`
- This version does not have any functionality for changing user, but you can always do so by changing the line `let userID = "1336348896317857792";` to another number in `assets/js/main.js`
  - It would be best to ensure you read up on the `API` over at [JSONBlob](https://jsonblob.com/) and create an ID via an initial `POST` request

### API Dependencies
- The system for saving and loading snippets to the cloud relies on the `API` from [JSONBlob](https://jsonblob.com/)