const { app, BrowserWindow, BrowserView, Menu, ipcMain, autoUpdater } = require('electron');

function createWindow () {
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
    icon: "./Tint.ico"
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

