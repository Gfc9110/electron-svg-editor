const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

require("electron-reload")(__dirname);

function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
    backgroundColor: "white",
    frame: false,
  });

  mainWindow.loadFile("index.html");

  ipcMain.on("closeApp", () => {
    app.quit();
  });

  ipcMain.on("minimizeApp", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximizeApp", () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });

  ipcMain.on("saveSVG", (_, svgText) => {
    dialog
      .showSaveDialog(mainWindow, {
        filters: [{ name: "SVG", extensions: ["svg"] }],
      })
      .then((result) => {
        if (!result.canceled) {
          fs.writeFile(result.filePath, svgText, {}, console.log);
        }
      });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
