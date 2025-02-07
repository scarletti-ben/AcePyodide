// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

let userData;
let snippets;

// =======================================================
// Functionality
// =======================================================

// Get the full userURL for a given userID
function userURL(userID) {
    let baseUrl = "https://jsonblob.com/api/jsonBlob/";
    let url = `${baseUrl}${userID}`;
    return url;
}

// Read the JSON file for a given userID and return data
async function readFile(userID) {
    let url = userURL(userID);
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
}

// Update the full JSON storage file with new data
async function updateStorage(userID, userData) {
    let url = userURL(userID);
    const response = await fetch(url, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    });
    return response;
}

// Add a snippet to local snippets
function addLocalSnippet(name, snippet) {
    snippets[name] = snippet;
}

// Remove a snippet from local snippets
function removeLocalSnippet(name) {
    delete snippets[name];
}

// Replace text in the editor with snippet
function loadSnippet(editor) {
    const text = Object.values(snippets).at(-1);
    editor.setValue(text.trim());
    editor.clearSelection();
}

// Delete most recent local snippet
function deleteLocalSnippet() {
    const key = Object.keys(snippets).at(-1);
    delete snippets[key];
}

// Save editor contents to a file with a given filename
function saveToFile(filename, editor) {
    let content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Load editor contents from file
function loadFromFile(editor) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.py';
    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            editor.setValue(reader.result);
            editor.clearSelection();
        };
        reader.readAsText(file);
    };
    input.click();
}

// Navigate to the raw JSON link
function openRaw(userID) {
    let url = userURL(userID);
    window.open(url, '_blank');
}

// Initialise snippet storage
async function storageInit(userID) {
    userData = await readFile(userID);
    snippets = userData.micropip.snippets;
}