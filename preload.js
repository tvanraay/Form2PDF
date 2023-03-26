const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    postCSV: (filepath) => ipcRenderer.send('postCSV', filepath),
    postPDF: (filepath) => ipcRenderer.send('postPDF', filepath),

    getCSV: () => ipcRenderer.invoke('getCSV'),
    getPDF: () => ipcRenderer.invoke('getPDF'),
    
    processPDF: () => ipcRenderer.invoke('processPDF')
});
