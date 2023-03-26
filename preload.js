const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    postFilePath: (filepath) => ipcRenderer.send('postFilePath', filepath),
    getFilePath: () => ipcRenderer.invoke('getFilePath'),
});
