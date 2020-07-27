import { app, BrowserWindow, screen } from 'electron';
import {autoUpdater} from 'electron-updater';
import * as path from 'path';
import * as url from 'url';
const electronLog = require('electron-log');

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  //const electronScreen = screen;
  //const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const size = {height: 768,width: 1024};

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    icon: path.join(__dirname, 'src/assets/icons/favicon.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.webContents.on('did-finish-load', () => {
    const version = require('./package.json').version;
    win.setTitle(`EventViewer++ ${version}`);
  });

}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow();
    electronLog.info("app started!!!");
    //setupAutoUpdaterLogging();
    autoUpdater.checkForUpdatesAndNotify();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // app.on('activate', () => {
  //   // On OS X it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (win === null) {
  //     createWindow();
  //   }
  // });

} catch (e) {
  // Catch Error
  // throw e;
}

//#region autoUpdater
function setupAutoUpdaterLogging() {
  //%USERPROFILE%\AppData\Roaming\event-viewer-pp\logs\main.log
  electronLog.transports.file.level = "debug";
  autoUpdater.logger = electronLog;
}
//#endregion