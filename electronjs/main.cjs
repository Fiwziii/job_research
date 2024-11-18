const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Use preload script
            contextIsolation: false,
            nodeIntegration: false,
        },
    });
    // console.log(process.env.NODE_ENV)
    // if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
    // } else {
        // mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    // }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
