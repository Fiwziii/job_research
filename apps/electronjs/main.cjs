const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow = null;
const checkServer = (url) =>
    new Promise((resolve) => {
      const http = require('http');
      const req = http
        .get(url, () => resolve(true))
        .on('error', () => resolve(false));
      req.end();
    });
  
  const waitForServer = async (url) => {
    let serverReady = false;
    while (!serverReady) {
      serverReady = await checkServer(url);
      if (!serverReady) await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };
  
app.on('ready', async() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Use preload script
            contextIsolation: false,
            nodeIntegration: false,
        },
    });
    await waitForServer('http://localhost:5173');
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