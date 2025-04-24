# AcePyodide

## Overview
This is a combination of a few of my projects, involving `pyodide`, `ace editor` and a project to create an expandable toolbar

### Features
- An embedded `Ace` text editor with syntax highlighting for `Python`, information about `Ace` can be found [here](https://ace.c9.io/)
- Uses a version of `Python` that is packaged for the web, called `Pyodide`, it runs entirely in your browser and does not rely on an external server, information can be found [here](https://pyodide.org/en/stable/)
- A simple "terminal" window for output
- A "toolbar" in the bottom right to give easy access to app functionality on desktop and mobile
  - The toolbar uses recognisable `Google Material Icons`
- Layout switching functionality to make it easier to edit and run code
- A custom system of "serverless" data storage that doesn't require an `API Key` and could be used across multiple devices, utilising requests to and from [JSONBlob](https://jsonblob.com/), passing `JSON` data
  - `userID` generated for new users, returning users are remembered
    - Reuse `userID` across multiple devices for shared storage
  - Save files, edit files, edit file names, delete files
  - Download files to device, upload from device
- Easy access to editor buttons, undo, redo, copy, paste

### Information
- Very little effort, if any, has been put into error catching in `JavaScript`
  - I am aware this will be my downfall, but as a demo project it makes it easier for me to read the code
- This version is about as "rough and ready" as can be, with a pure focus on adding features, regardless of the cleanliness of the code
  - Future versions will likely focus on more "programatic" generation of the `HTML` and its elements, and defining more reusable functions in `JavaScript`
- `Pyodide` has its "quirks", and the current setup is running your code in an `asynchronous` environment so as to allow for dynamic imports via `URL`, this means you can get some very curious `tracebacks` that you wouldn't see in `synchronous` code, often pertaining to `coroutines`
  - It can often be better to reload the page between runs to clear global variables, and avoid a few of the "quirks"

# Disclaimers
- Any files saved via the cloud save function are publically accessible, do not save any sensitive data, one example of this would be hard-coded `API` keys
- When loading the site for the first time it will ask you for a `userID`, if you do not have one from a previous session you ask it to create one for you
  - It can be useful to save this `userID` in case you switch devices and want to have shared data between them
- There are no passwords, saved data is uploaded in `JSON` format to a `URL` that looks like this `https://jsonblob.com/{ID}`
- Files on the `JSONBlob` site are deleted if they haven't been accessed in the last 30 days, so this storage isn't safe, remember to download any files that matter to your device!

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

# TODO

### Hard
- fix enter to autocomplete
- fix editor gutter size
- fix editor margin on right
- fix editor margin space at the bottom so scroll happens above bottom
- shift date and name around so all snippets have date, and at first name: is same, but can be edited so you don't need a key change, only a value change
- fix editor resize issue where a horizontal scrollbar is shown on page load if loading into layout-left

### Closed
- ~~Disable zoom / scroll on mobile devices~~
- ~~mobile width for file system more~~
  - ~~close button may need to be top~~
- ~~issue the blur~~
- ~~mention 30 day rule for jsonblob~~
  - ~~make sure create new user runs if userID invalid~~
- ~~add autosave snippet~~ **dangerous for API keys** 
- ~~add undo and redo buttons~~
- ~~add copy and paste buttons~~
- ~~remove the old left right buttons~~
- ~~switch user~~
- ~~trim value passed on file edit~~
- ~~rename snippets~~
- ~~css for snippets popup thing~~
- ~~css for the settings menu for ace~~
- ~~Flip chevron~~

### Open
- Animation for chevron flip

```yaml
---
metadata:
  author: "Ben Scarletti"
  date: "2025-04-24"
  description: "AcePyodide is a browser-based Python editor using Ace and Pyodide, with serverless cloud storage using JSONBlob"
  tags: [
    "dev", "webdev", "programming", "coding", "python", "javascript", "html", "css", "wasm", "pyodide", "ace", "ace editor", "jsonblob", "api", "static site", "github pages", "cloud storage", "toolbar", "google material icons", "requests", "http methods", "post request", "get request", "fetch"
  ]
---
```