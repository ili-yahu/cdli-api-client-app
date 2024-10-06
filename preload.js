const { contextBridge, ipcRenderer } = require('electron');

// Expose the API
contextBridge.exposeInMainWorld('api', {
    getDesktopPath: () => ipcRenderer.invoke('get-desktop-path'),
    executeCommand: (command, outputFolder) => ipcRenderer.invoke('execute-command', command, outputFolder),
    selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
});
