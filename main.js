const spawn = require("cross-spawn");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

const EXPORT_PDF_NAME = "FilledExport.pdf";

let exportDirectoryPath = null;
let inputCSVPath = null;
let inputPDFPath = null;  

function getExePath() {
  return path.resolve(app.getAppPath(), `./pyapi/dist/program/program`).replace("app.asar", "app.asar.unpacked");
}

/*************************************************************
 * IPC/API Handlers
 *************************************************************/

function postPDF(event, filepath) {
  inputPDFPath = filepath;
}

function postCSV(event, filepath) {
  inputCSVPath = filepath;
}

function log(event, message) {
  console.log(message);
}

function getCSV(event) {
  return inputCSVPath;
}

function getPDF(event) {
  return inputPDFPath;
}

function processPDF(event) {
  try {
    if (inputCSVPath == null || inputPDFPath == null) {
      return { error: "Please upload both a CSV and a PDF" };
    }
  
    selectDirectory();
  
    if (exportDirectoryPath == null || exportDirectoryPath == "" || exportDirectoryPath == "undefined" || exportDirectoryPath == "null" || exportDirectoryPath == "NaN" || exportDirectoryPath == undefined) {
      return "Must select a directory/path to export too";
    }

    const exportPath = path.join(exportDirectoryPath.toString(), EXPORT_PDF_NAME);
    const result = spawn.sync(getExePath(), [inputCSVPath, inputPDFPath, exportPath]);

    if (result.stderr == null || result.stderr == undefined || result.stderr.toString() == "" || result.stderr.toString() == " " || result.stderr.toString() == "\n") {
      return "Successfully Filled PDF"; 
    }

    return result.stderr.toString();
  } catch (err) {
    return err.message;
  }
}

function selectDirectory() {
  // Show a dialog box to select a directory
  exportDirectoryPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
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
  ipcMain.on("log", log);

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
