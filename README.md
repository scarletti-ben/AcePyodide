# AcePyodide

## Overview
This is a combination of a few of my projects, involving `pyodide`, `ace editor` and a personal project to create an expandable toolbar

### Features
- An embedded `Ace` text editor with `syntax highlighting` for `Python`, information about `Ace` can be found [here](https://ace.c9.io/)
- Uses a version of `Python` that is packaged for the web, called `Pyodide`, it runs entirely in your browser and does not rely on an external server, information can be found [here](https://pyodide.org/en/stable/)
- A simple "terminal" window for output
- A "toolbar" that has a button floating in the bottom right, to give easy access to app functionality on desktop and mobile
  - Uses `Google Material Icons`
- A custom system of "serverless" data storage that doesn't require an `API Key` and could be used across multiple devices, utilising requests to and from [JSONBlob](https://jsonblob.com/), passing `JSON` data

### Information
- Very little effort, if any, has been put into error catching in `JavaScript`
  - I am aware this will be my downfall, but as a demo project it makes it easier for me to read the code
- `Pyodide` has its "quirks", and the current setup is running your code in an `asynchronous` environment so as to allow for dynamic imports via `URL`, this means you can get some very curious `tracebacks` that you wouldn't see in `synchronous` code, often pertaining to `coroutines`
  - It can often be better to reload the page between runs to clear global variables, and avoid a few of the "quirks"

# Disclaimer
- Any files saved via the cloud save function are publically accessible, do not save any sensitive data, one example of this would be hard-coded `API` keys
- When loading the site for the first time it will ask you for a `userID`, if you do not have one from a previous session you ask it to create one for you
  - It can be useful to save this `userID` in case you switch devices and want to have shared data between them
- There are no passwords, saved data is uploaded in `JSON` format to a `URL` that looks like this `https://jsonblob.com/{ID}`

## Dependencies

### API Dependencies
- The system for saving and loading snippets to the cloud relies on the `API` from [JSONBlob](https://jsonblob.com/)

### CDN Dependencies
- Ace Editor
  - https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.5/ace.js
  - https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.5/ext-language_tools.js
- Pyodide
  - https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js

### Other Dependencies
- Google Material Icons
  - https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200