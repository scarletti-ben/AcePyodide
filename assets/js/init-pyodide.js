// =======================================================
// Constants, Variables, and Global Declarations
// =======================================================

const terminal = document.querySelector("#terminal");
let pyodide;
let micropip;

// =======================================================
// Functionality
// =======================================================

// Install Micropip, import it outside Python namespace
async function installMicropip() {
    await pyodide.loadPackage('micropip');
    micropip = pyodide.pyimport("micropip");
    terminal.textContent += " success\n";
}

// Install all packages in a given array using Micropip
async function installPackages(packageNames) {
    for (const packageName of packageNames) {
        terminal.textContent += `   ${packageName} installing...`;
        await micropip.install(packageName);
        terminal.textContent += ` success\n`;
    }
}

// Initialise Pyodide, with Micropip and custom packages
async function pyodideInit(packageNames) {
    terminal.textContent = "";
    terminal.textContent += "Pyodide loading...";
    pyodide = await loadPyodide();
    terminal.textContent += " success\n";
    terminal.textContent += "Micropip installing...";
    await installMicropip();
    if (packageNames) {
        terminal.textContent += "Packages installing...\n";
        await installPackages(packageNames);
        terminal.textContent = terminal.textContent.replace("Packages installing...", "Packages installing... success");
    }
}