// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

let userID;
let packageNames = ["requests"];
let page = document.getElementById("page");
let toolbarTop = document.getElementById("toolbar-top");
let mainButton = document.querySelector("#toolbar-bottom .icon");
let chevron = document.querySelector("#chevron");
const defaultText = `

# -----------------------------------------
# Information
# - You can edit the text below
# - Make sure it starts and ends with "
# - Works with text or could be a URL
#     - eg. text = "www.google.com"
# - Click ^ button in the bottom right
#     - Use button above it to 'run' code

text = "Hello, World"

# -----------------------------------------

import js
import micropip
await micropip.install("https://files.pythonhosted.org/packages/27/7c/abc460494640767edfce9c920da3e03df22327fc5e3d51c7857f50fd89c4/segno-1.6.1-py3-none-any.whl")
import segno
import mimetypes

filename = "qr.png"
qr_data = segno.make_qr(text)
qr_data.save(filename, scale = 5)

def download(filename: str, data: any, revoke_delay: int = 1000) -> None:
    """Initiate user download for a given filename and data object"""
    fallback: str = "application/octet-stream"
    mimetype: str = mimetypes.guess_type(filename)[0] or fallback
    blob = js.Blob.new([data], {"type": mimetype})
    uri = js.window.URL.createObjectURL(blob)
    link = js.document.createElement("a")
    link.href = uri
    link.download = filename
    link.click()
    revoke_function = lambda: js.window.URL.revokeObjectURL(uri)
    js.setTimeout(revoke_function, revoke_delay)

binary_data = open(filename, "rb").read()
js_binary = js.Uint8Array.new(binary_data)
download(filename, js_binary)

`;

// ! ======================================================
// ! Testing
// ! ======================================================

// Saves a given userID to localStorage
function setUserID(userID) {
    localStorage.setItem("userID", userID);
}

// Loads userID from localStorage and returns
function getUserID() {
    return localStorage.getItem("userID");
}

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

// Copy text to clipboard and log to terminal
function copyToClipboard(text, message_success, message_error) {
    navigator.clipboard.writeText(text)
        .then(() => {
            addLine(message_success);
        })
        .catch(err => {
            addLine(message_error);
        });
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
        setTimeout(() => editor.resize(), 0);
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
    setTimeout(() => editor.resize(), 0);
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
    chevron.classList.toggle("flipped");
}

function editorOnly() {
    terminal.style.display = "none";
    document.getElementById("editor").style.display = "flex";
    setTimeout(() => editor.resize(), 0);
}

function terminalOnly() {
    document.getElementById("editor").style.display = "none";
    terminal.style.display = "flex";
    setTimeout(() => editor.resize(), 0);
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

// document.getElementById("file-next").addEventListener("click", () => {
//     loadSnippet(editor);
//     addLine("Loaded most recent snippet from cloud");
// });

// document.getElementById("file-previous").addEventListener("click", () => {
//     loadSnippet(editor);
//     addLine("Loaded most recent snippet from cloud");
// });

function loadMostRecent() {
    loadSnippet(editor);
    addLine("Loaded most recent snippet from cloud");
}

document.getElementById("editor-settings").addEventListener("click", () => {
    editor.execCommand("showSettingsMenu");
});

document.getElementById("cloud-open").addEventListener("click", () => {
    addLine("Opening raw JSON in new tab");
    openRaw(userID);
});

document.getElementById("cloud-delete").addEventListener("click", () => {
    deleteLocalSnippet();
    updateStorage(userID, userData);
    addLine("Deleted most recent cloud snippet");
});

document.getElementById("local-download").addEventListener("click", () => {
    addLine("Saving to local file");
    let filename = getDateString() + ".py";
    saveToFile(filename, editor);
});

document.getElementById("local-upload").addEventListener("click", () => {
    addLine("Loading from local file");
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
        loadMostRecent();
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
    addLine(`Added cloud snippet with date ${dateString}`);

});

document.getElementById("open-filesystem").addEventListener("click", () => {
    let container = document.querySelector("#file-window-container");
    container.classList.remove("hidden");
    toggleToolbar();
    MADNESS();
});

document.getElementById("close-filesystem").addEventListener("click", () => {
    let container = document.querySelector("#file-window-container");
    container.classList.add("hidden");
});

document.getElementById("editor-undo").addEventListener("click", () => {
    editor.undo();
});

document.getElementById("editor-redo").addEventListener("click", () => {
    editor.redo();
});

document.getElementById("editor-copy").addEventListener("click", () => {
    const content = editor.getValue();
    navigator.clipboard.writeText(content);
});

document.getElementById("editor-paste").addEventListener("click", async () => {
    const content = await navigator.clipboard.readText();
    editor.insert(content);
});



function clickListen(selector, func) {
    let element = document.querySelector(selector);
    element.addEventListener("click", func);
}

async function switchUser() {
    let newID = prompt("Enter ID number, leave empty to generate new ID:");
    let newData = await readFile(newID);
    let newSnippets = newData?.micropip?.snippets;
    if (newSnippets == null) {
        alert(`User ID: ${newID} is not valid, it may have expired`)
    }
    else {
        setUserID(newID);
        addLine(`User ID Saved: ${newID}`);
        await storageInit(newID);
    };
}
clickListen("#switch-user", switchUser);

function MADNESS() {

    let files = snippets;

    // Populate #file-window with files from data.micropip.snippets
    function populateFileWindow(files) {

        let fileWindow = document.querySelector("#file-window");
        fileWindow.innerHTML = '';

        // Save editor contents to a file with a given filename
        function save(filename, content) {
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        }

        async function deleteSnippet(key) {
            delete snippets[key];
            await updateStorage(userID, userData);
            populateFileWindow(snippets);
        }

        for (const [key, value] of Object.entries(files)) {
            const container = document.createElement("div");
            container.classList.add("file-container");

            const header = document.createElement("h3");
            header.classList.add("file-header");
            const contents = document.createElement("pre");
            contents.classList.add("file-content");


            const row = document.createElement('div');
            row.classList.add("icon-row");

            let icons = {
                'delete': 'Delete',
                'edit': 'Edit',
                'download': 'Download',
            }


            for (const [identifier, name] of Object.entries(icons)) {
                const icon = document.createElement('span');
                const symbol = document.createElement('span');
                icon.classList.add('icon');
                icon.style.setProperty("background-color", "transparent", "important");
                symbol.classList.add('material-symbols-outlined');
                symbol.textContent = identifier;
                icon.title = name;

                if (identifier === "delete") {
                    icon.addEventListener("click", () => {
                        deleteSnippet(key);
                    })
                }
                else if (identifier === "edit") {
                    icon.addEventListener("click", () => {
                        editor.setValue(value.trim());
                        editor.clearSelection();
                        let container = document.querySelector("#file-window-container");
                        container.classList.add("hidden");
                    })
                }
                else if (identifier === "download") {
                    icon.addEventListener("click", () => {
                        save(key + ".py", value);
                    })
                }

                icon.appendChild(symbol);
                row.appendChild(icon);
            }

            let editable = document.createElement("span");
            editable.innerText = key;
            editable.contentEditable = "true";
            let extension = document.createElement("span");
            extension.innerText = ".py";
            header.appendChild(editable);
            header.appendChild(extension);

            editable.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    let newKey = editable.textContent;
                    if (snippets.hasOwnProperty('key')) {
                        alert("Name already exists");
                        editable.textContent = key;
                    }
                    else if (newKey.length === 0) {
                        alert("Name cannot be empty");
                        editable.textContent = key;
                    }
                    else {

                        let keys = Object.keys(snippets);
                        let index = keys.indexOf(key);
                        delete snippets[key];
                        keys.splice(index, 0, newKey);
                        snippets[newKey] = value;
                        updateStorage(userID, userData);
                        addLine(`${key}.py renamed to ${newKey}.py`)
                        addLine(`updated cloud storage`)
                    }
                }
            });

            contents.textContent = value;
            container.appendChild(header);
            container.appendChild(contents);
            container.appendChild(row);
            fileWindow.appendChild(container);
        }

    }

    populateFileWindow(files);

}

// =======================================================
// Functionality
// =======================================================

// Ensures Pyodide and Ace have initialised before running
async function main() {

    await aceInit();
    await pyodideInit(packageNames);
    hijackPrint(pyodide);

    userID = getUserID();
    // userID = null;
    console.log(userID);
    if (!userID) {
        console.log(userID);
        userID = prompt("Enter ID number, leave empty to generate new ID:");
    }

    if (!userID) {
        let dateString = getDateString();
        let data = {
            "micropip": {
                "snippets": {
                    [dateString]: defaultText
                }
            }
        }
        userID = await createStorage(data);
        addLine(`New User Created: ${userID}`);
        // let message_success = `User ID: ${userID} copied to clipboard`;
        // let message_error = `User ID cannot be copied to clipboard due to user preferences`;
        // copyToClipboard(userID, message_success, message_error);
    }
    else {
        addLine(`Existing User Login: ${userID}`);

    }

    if (!getUserID()) {
        setUserID(userID);
        addLine(`User ID Saved: ${userID}`);
    }

    async function storageInitialise() {
        let storageSuccess = await storageInit(userID);
        if (storageSuccess == null) {
            alert(`User ID: ${userID} is not valid, it may have expired`)
            userID = prompt("Enter ID number, leave empty to generate new ID:");

            if (!userID) {
                let dateString = getDateString();
                let data = {
                    "micropip": {
                        "snippets": {
                            [dateString]: defaultText
                        }
                    }
                }
                userID = await createStorage(data);
                addLine(`New User Created: ${userID}`);
            }
            else {
                addLine(`Existing User Login: ${userID}`);

            }

            setUserID(userID);
            addLine(`User ID Saved: ${userID}`);
            await storageInit(userID);

        }
    }

    await storageInitialise();

    // document.getElementById("file-next").click();
    loadMostRecent();

    // editor.setValue(text.trim());
    editor.clearSelection();

}

// =======================================================
// Execution
// =======================================================

window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

if (window.mobileCheck()) {
    page.className = "layout-top";
}

main().then(() => {
    setTimeout(() => editor.resize(), 0);
    document.querySelector("#toolbar-container").classList.toggle("hidden");
});