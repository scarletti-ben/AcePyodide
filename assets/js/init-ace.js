// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

const editor = ace.edit("editor");

// =======================================================
// Functionality
// =======================================================

// Change the colour of the scrollbar of the editor
function setEditorScrollColour(gutterColour, sliderColour) {
    const scrollbar = editor.container.querySelector('.ace_scrollbar');
    scrollbar.style.scrollbarColor = `${sliderColour} ${gutterColour}`;
}

// Get the CSS styling for the current theme
function getThemeCSS() {
    let theme = editor.getTheme();
    let name = theme.split('/')[2]
    let selector = `.ace-${name}`
    let element = document.querySelector(selector);
    var computedStyle = window.getComputedStyle(element);
    return computedStyle
}

// Get the CSS styling for the editor gutter
function getGutterCSS() {
    let selector = `.ace_gutter`
    let element = document.querySelector(selector);
    var computedStyle = window.getComputedStyle(element);
    return computedStyle
}

// Initialise Ace editor with optional text argument
async function aceInit(text = "") {
    editor.session.setMode("ace/mode/python");
    editor.setOptions({
        autoScrollEditorIntoView: true,
        displayIndentGuides: false,
        tabSize: 4,
        useSoftTabs: true,
        wrap: true,
        showPrintMargin: false,
        showInvisibles: false,
        highlightActiveLine: false,
        // fixedGutterWidth: true,
        highlightGutterLine: false,
        theme: "ace/theme/gruvbox",
        highlightSelectedWord: false,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        readOnly: false
    });
    editor.renderer.setScrollMargin(16, 0);
    // editor.renderer.setGutterWidth(128);
    editor.setValue(text.trim());
    editor.clearSelection();
    // editor.focus();
    setEditorScrollColour("transparent", "transparent");
}