const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    executeCommand: (command, outputFolder) => ipcRenderer.invoke('execute-command', command, outputFolder),
    selectOutputFolder: () => ipcRenderer.invoke('select-output-folder') // Function for folder selection
});
