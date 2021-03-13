const { app, BrowserWindow } = require("electron");

function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#333",
    webPreferences: { nodeIntegration: true },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createMainWindow);

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
