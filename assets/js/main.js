// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

let userID = "1336348896317857792";
let packageNames = ["requests", "pillow", "numpy"];
let page = document.getElementById("page");
let toolbarTop = document.getElementById("toolbar-top");
let mainButton = document.querySelector("#toolbar-bottom .icon");
const defaultText = ``;

// ! ======================================================
// ! Testing
// ! ======================================================

// Function to add a line to the terminal
function addLine(line, newlines = 0, end = "\n") {
    if (terminal.textContent === '') {
        terminal.textContent = line + end;
    }
    else {
        terminal.textContent += '\n'.repeat(newlines) + line + end;
    }
    terminal.scrollTop = terminal.scrollHeight;
}

// Disable default save site functionality
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
    }
});

// Function to process Python output from pyodide.runPython(code)
function processOutput(output) {
    console.log("Python output has been disabled, use print statements instead");
}

// Function to process Python errors from pyodide.runPython(code)
function processError(error) {
    let line = `[Error] ${[error]}`;
    addLine(line);
}

// Function to process Python print calls from pyodide.runPython(code)
function processPrint(text) {
    let line = `[Print] ${[text]}`;
    addLine(line, 0);
}

// Function to evaluate a given string of Python code
async function evaluatePythonAsync(code) {
    try {
        addLine("[Run Start]", 1)
        let output = await pyodide.runPythonAsync(code);
        processOutput(output);
        addLine("[Run Ended]", 0)
    }
    catch (error) {
        processError(error);
    }
}

// Function to evaluate python code from the editor
async function evaluateEditorAsync() {
    code = editor.getValue();
    await evaluatePythonAsync(code);
}

// Function to allow 'print' statements from Python to be passed to JavaScript
function hijackPrint() {
    pyodide.globals.set('print', text => processPrint(text));
}

let layoutButtons = document.querySelectorAll('[id^="layout-"]');
for (const button of layoutButtons) {
    button.addEventListener("click", () => {
        terminal.style.display = "flex";
        document.getElementById("editor").style.display = "flex";
        page.className = button.id;
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function getDateString() {
    var currentdate = new Date();
    let pad = (value) => `0${value}`.slice(-2);
    var YYYY = currentdate.getFullYear();
    var MM = pad(currentdate.getMonth() + 1);
    var DD = pad(currentdate.getDate());
    var HH = pad(currentdate.getHours());
    var mm = pad(currentdate.getMinutes());
    var ss = pad(currentdate.getSeconds());
    return `${YYYY}-${MM}-${DD}_${HH}-${mm}-${ss}`
}

// Toggle hidden for the top part of the toolbar 
function toggleToolbar() {
    toolbarTop.classList.toggle("hidden");
}

function editorOnly() {
    terminal.style.display = "none";
    document.getElementById("editor").style.display = "flex";
}

function terminalOnly() {
    document.getElementById("editor").style.display = "none";
    terminal.style.display = "flex";
}

mainButton.addEventListener("click", toggleToolbar);
document.getElementById("only-editor").addEventListener("click", editorOnly);
document.getElementById("only-terminal").addEventListener("click", terminalOnly);
document.getElementById("toggle-fullscreen").addEventListener("click", toggleFullscreen);
document.getElementById("run-code").addEventListener("click", evaluateEditorAsync);

// document.getElementById("tool-1").addEventListener("click", () => {
//     let dateString = getDateString();
//     addLocalSnippet(dateString, editor.getValue());
//     terminal.textContent += "added local snippet\n";
// });

// document.getElementById("tool-2").addEventListener("click", () => {
//     updateStorage(userID, userData);
//     terminal.textContent += "updated external snippets\n";
// });

document.getElementById("file-next").addEventListener("click", () => {
    loadSnippet(editor);
    addLine("loaded snippet from cloud");
});

document.getElementById("editor-settings").addEventListener("click", () => {
    editor.execCommand("showSettingsMenu");
});

document.getElementById("cloud-open").addEventListener("click", () => {
    addLine("opening raw JSON in new tab");
    openRaw(userID);
});

document.getElementById("cloud-delete").addEventListener("click", () => {
    deleteLocalSnippet();
    updateStorage(userID, userData);
    addLine("deleted most recent cloud snippet");
});

document.getElementById("local-download").addEventListener("click", () => {
    addLine("saving to local file");
    let filename = "test.py";
    saveToFile(filename, editor);
});

document.getElementById("local-upload").addEventListener("click", () => {
    addLine("loading from local file");
    loadFromFile(editor);
});

document.getElementById("clear-editor").addEventListener("click", () => {
    editor.setValue("");
});

document.getElementById("clear-terminal").addEventListener("click", () => {
    terminal.textContent = "";
});


document.addEventListener('keydown', function (event) {
    if (event.code === 'Numpad1') {
        event.preventDefault();
        document.getElementById("clear-terminal").click();
    } 
    else if (event.code === 'Numpad2') {
        event.preventDefault();
        document.getElementById("run-code").click();
    }
    else if (event.code === 'Numpad3') {
        event.preventDefault();
        document.getElementById("cloud-upload").click();
    }
    else if (event.code === 'Numpad4') {
        event.preventDefault();
        document.getElementById("cloud-delete").click();
    }
    else if (event.code === 'Numpad4') {
        event.preventDefault();
        document.getElementById("file-next").click();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'F2') {
        e.preventDefault();
        handleF2(e);
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'F3') {
        e.preventDefault();
        handleF3(e);
    }
});

document.getElementById("cloud-upload").addEventListener("click", () => {
    let dateString = getDateString();
    addLocalSnippet(dateString, editor.getValue());
    updateStorage(userID, userData);
    addLine(`added cloud snippet with date ${dateString}`);

});

// =======================================================
// Functionality
// =======================================================

// Ensures Pyodide and Ace have initialised before running
async function main() {
    await aceInit();
    await pyodideInit(packageNames);
    hijackPrint(pyodide);
    await storageInit(userID);
    document.getElementById("file-next").click();
}

// =======================================================
// Execution
// =======================================================

main();