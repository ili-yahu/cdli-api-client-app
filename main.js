const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process'); // Import exec from child_process
const os = require('os');

// Function to create the main window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'resources/cdli-api-logo.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    win.loadFile('index.html');
};

// Register the handler for getting the desktop path
ipcMain.handle('get-desktop-path', async () => {
    const desktopPath = path.join(os.homedir(), 'Desktop'); // Construct the desktop path
    return desktopPath; // Return the path
});

// Get the correct path for the cli.js file based on the app environment
const getCliPath = () => {
    // Use `app.getAppPath()` to dynamically get the correct path after packaging
    return path.join(app.getAppPath(), 'node_modules', 'cdli-api-client', 'cli.js');
};

// Handle the command execution
ipcMain.handle('execute-command', async (event, command, outputFolder) => {
    return new Promise((resolve, reject) => {
        const cliPath = getCliPath();  // Get the correct cli path
        const fullCommand = `cdli ${command}`;
        exec(fullCommand, { cwd: outputFolder }, (error, stdout, stderr) => {
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
