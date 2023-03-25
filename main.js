const { app, BrowserWindow } = require("electron");
const path = require("path");
const spawn = require("child_process").spawn;

const PY_FOLDER = "pyapi";
// const PY_MODULE = 'api' // without .py suffix

let pyProcess = null;
let pyPort = null;

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER);
  return require("fs").existsSync(fullPath);
};

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + ".py");
  }
  if (process.platform === "win32") {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + ".exe");
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE);
};

const selectPort = () => {
  pyPort = 4242;
  return pyPort;
};

const createPyProc = () => {
  let script = getScriptPath();
  let port = "" + selectPort();

  if (guessPackaged()) {
    pyProcess = require("child_process").execFile(script, [port]);
  } else {
    pyProcess = require("child_process").spawn("python", [script, port]);
  }

  if (pyProcess != null) {
    //console.log(pyProcess)
    console.log("child process success on port " + port);
  }
};

const exitPyProc = () => {
  pyProcess.kill();
  pyProcess = null;
  pyPort = null;
};

//app.on("ready", createPyProc);
//app.on("will-quit", exitPyProc);

/*************************************************************
 * window management
 *************************************************************/

let mainWindow = null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
