'use strict';

// Electron module
var electron = require('electron');

// Module that controls the app
var app = electron.app;

// Module to create window
var BrowserWindow = electron.BrowserWindow;

// Main window
var mainWindow;

// Exit when all windows are closed
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Execute after Electron initialization
app.on('ready', function() {
  // Display main screen. Window width and height
  mainWindow = new BrowserWindow({width: 240, height: 350});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools on starting the app
  // mainWindow.webContents.openDevTools()

  // App exits when window is closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});