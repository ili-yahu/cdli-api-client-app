const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');

// Function to create the main window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    win.loadFile('index.html');
};

// Handle the command execution
ipcMain.handle('execute-command', async (event, command) => {
    return new Promise((resolve, reject) => {
        exec(`cdli ${command}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
});

// Handle folder selection
ipcMain.handle('select-output-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'] // Allow folder selection
    });
    return result.filePaths[0]; // Return the selected folder path
});

// App event listeners
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

