const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

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
