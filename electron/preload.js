const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('boneGyre2', {
  appName: 'bone-gyre-2',
  isElectron: true,
  onShowProperties: (callback) => {
    ipcRenderer.on('show-properties', callback);
  },
  saveSpineExport: (payload) => ipcRenderer.invoke('save-spine-export', payload)
});
