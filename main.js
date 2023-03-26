const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const spawn = require("child_process").spawn;

const PY_FOLDER = "pyapi";
const PY_MODULE = "program";
let pyProcess = null;
let pyPort = null;
let inputCSVPath = null;
let inputPDFPath = null;

function getScriptPath() {
  return path.join(__dirname, PY_FOLDER, PY_MODULE + ".py");
}

function callPyProc(csv, pdf) {
  let script = getScriptPath();

  pyProcess = spawn("python", [script, csv, pdf]);

  if (pyProcess != null) {
    console.log("child process creation success");
  }
}

function exitPyProc() {
  if (pyProcess != null) {
    pyProcess.kill();
    pyProcess = null;
    pyPort = null;
    console.log("child process killed");
  }
}

app.on("will-quit", exitPyProc);

/*************************************************************
 * IPC/API Handlers
 *************************************************************/

function postPDF(event, filepath) {
  inputPDFPath = filepath;
}

function postCSV(event, filepath) {
  inputCSVPath = filepath;
}

function getCSV(event) {
  return inputCSVPath;
}

function getPDF(event) {
  return inputPDFPath;
}

function processPDF(event) {
  if (inputCSVPath == null || inputPDFPath == null) {
    return { error: "Please upload both a CSV and a PDF" };
  }

  callPyProc(inputCSVPath, inputPDFPath);

  return {
    pdf: inputPDFPath,
    csv: inputCSVPath,
  };
}

/*************************************************************
 * window management
 *************************************************************/

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // api invokation handlers
  ipcMain.on("postCSV", postCSV);
  ipcMain.on("postPDF", postPDF);

  win.loadFile("index.html");
}

app.whenReady().then(() => {

  // api return handlers
  ipcMain.handle("getCSV", getCSV);
  ipcMain.handle("getPDF", getPDF);
  ipcMain.handle("processPDF", processPDF);

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
