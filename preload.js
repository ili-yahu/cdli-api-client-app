const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    executeCommand: (command) => ipcRenderer.invoke('execute-command', command)
});