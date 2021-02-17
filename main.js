const { app, BrowserWindow, BrowserView, Menu, ipcMain, autoUpdater, Tray } = require('electron');

function createWindow () {
  var appPath = app.getAppPath();
  const win = new BrowserWindow({
    width: 500,
    height: 700,
    minHeight: 700,
    minWidth: 500,
    maxHeight: 700,
    maxWidth: 500,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    },
    frame: false,
    transparent: true,
    icon: appPath + "\\Tint.ico"
  })

  var winMaxed = win.isMaximized();

  win.loadFile('index.html')

  win.removeMenu()

  win.setFullScreenable(false)
  win.setResizable(false)

  win.focus()

  //win.webContents.openDevTools();

  ipcMain.on('close-me', (evt, arg) => {
    app.quit()
  })
  
  ipcMain.on('minimize-me', (evt, arg) => {
    win.minimize()
  })

  ipcMain.on('minimizeTray-me', (evt, arg) => {
    win.setSkipTaskbar(true);
    tray = createTray();
    win.hide();
  });

  let tray = null;

  win.on('show', function (event) {
    win.setSkipTaskbar(false);
    tray.destroy();
  });

  function createTray() {
    let appIcon = new Tray(appPath + "\\Tint.ico");
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show', click: function () {
          win.show();
        }
      },
        {
          label: 'Exit', click: function () {
            app.isQuiting = true;
            app.quit();
          }
        }
    ]);

    appIcon.on('double-click', function (event) {
      win.show();
    });
    appIcon.setToolTip('Tint');
    appIcon.setContextMenu(contextMenu);
    return appIcon;
  }

  var userPath = app.getPath('userData');

  ipcMain.on('userDataFolder', async (event) => {
    event.reply('userDataFolder', userPath);
  });
  
  /*
  ipcMain.on('maximize-me', (evt, arg) => {
    if (winMaxed == false) {
      win.maximize()
      win.focus()
    }
    else if (winMaxed == true) {
      win.unmaximize()
    }
  }) */
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on(`display-app-menu`, function(e, args) {
  if (isWindows && mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y
    });
  }
});

