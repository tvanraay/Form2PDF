const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const spawn = require("child_process").spawn;

const PY_FOLDER = "pyapi";
const PY_MODULE = "program";
const PY_ACTIVATE = "venv/bin/activate";

let inputCSVPath = null;
let inputPDFPath = null;

function getScriptPath() {
  return path.join(__dirname, PY_FOLDER, PY_MODULE + ".py");
}

function getVenvPath() {
  return path.join(__dirname, PY_FOLDER, PY_ACTIVATE);
}

function callPyProc(csv, pdf) {
  return new Promise((resolve) => {
    const pythonScriptPath = getScriptPath();
    const activatePath = getVenvPath();

    const pyProcess = spawn('bash', ['-c', `source ${activatePath} && python3 ${pythonScriptPath} ${csv} ${pdf} ${__dirname}/pyapi/bin/test.pdf`]);

    if (pyProcess != null) {
      console.log("child process created");
    }
  
    pyProcess.on('error', (err) => {
      resolve(err.message);
    });
    
    pyProcess.stderr.on('data', (err) => {
      resolve(err.toString());
    });

    pyProcess.on('exit', (code, signal) => {
      if (code === 0) {
        resolve('Script finished successfully');
      } else {
        resolve(`Script exited with code ${code} and signal ${signal}`);
      }
    });
  });
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

function getCSV(event) {
  return inputCSVPath;
}

function getPDF(event) {
  return inputPDFPath;
}

async function processPDF(event) {
  if (inputCSVPath == null || inputPDFPath == null) {
    return { error: "Please upload both a CSV and a PDF" };
  }

  return await callPyProc(inputCSVPath, inputPDFPath);
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
