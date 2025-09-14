// main-debug.js (replace your current main.js for debugging)
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createMainWindow() {
  const preloadPath = path.join(__dirname, "preload.js");
  console.log("[main] __dirname:", __dirname);
  console.log("[main] preload path:", preloadPath);
  console.log("[main] preload exists:", fs.existsSync(preloadPath));

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // explicitly disable sandbox for preload
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createMainWindow);

ipcMain.handle("select-folder", async () => {
  const win = mainWindow || BrowserWindow.getFocusedWindow() || null;
  const result = await dialog.showOpenDialog(win, { properties: ["openDirectory"] });
  return result.canceled ? null : result.filePaths[0];
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
