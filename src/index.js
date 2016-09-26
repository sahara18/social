import qs from 'qs';
import url from 'url';
import _ from 'lodash';
import path from 'path';
import {app, BrowserWindow, ipcMain} from 'electron';
import shortcut from 'electron-localshortcut';

let mainWindow;
let vkAuthUrl = 'https://oauth.vk.com/blank.html';

function modal(options) {
  let win = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    ..._.omit(options, 'url')
  });
  win.loadURL(options.url);
  return win;
}

ipcMain.on('vk auth', ({sender}) => {
  let authUrl = url.format({
    pathname: 'https://oauth.vk.com/authorize',
    query: {
      client_id: 5644624,
      display: 'page',
      redirect_uri: vkAuthUrl,
      scope: 'wall,friends',
      response_type: 'token',
      v: 5.52
    }
  });

  let win = modal({
    url: authUrl
  });
  win.webContents.on('did-navigate', (e, location) => {
    if (_.startsWith(location, vkAuthUrl)) {
      let hash = url.parse(location).hash;
      let accessToken = qs.parse(hash.slice(1)).access_token;
      sender.send('vk auth', accessToken);
      win.hide(); // win.close() ??
    }
  });
});

function createApp() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL(`file://${path.resolve(__dirname, '..')}/index.html`);
  mainWindow.webContents.openDevTools();

  shortcut.register(mainWindow, 'F5', () => {
    mainWindow.webContents.reload();
  });

  mainWindow.on('closed', () => {
    shortcut.unregister(mainWindow, 'F5');
    mainWindow = null;
  });
}

app.on('ready', createApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createApp();
  }
});
