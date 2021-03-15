const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  closeApp: () => ipcRenderer.send("closeApp"),
  minimize: () => ipcRenderer.send("minimizeApp"),
  maximize: () => ipcRenderer.send("maximizeApp"),
  saveSVG: (text) => ipcRenderer.send("saveSVG", text),
});
