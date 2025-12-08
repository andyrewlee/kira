import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("kiraDesktop", {
  isDesktop: true,
  getVersion: () => ipcRenderer.invoke("kira:get-version"),
  openLogs: () => ipcRenderer.invoke("kira:open-logs"),
  selectAudioFile: () => ipcRenderer.invoke("kira:select-audio-file"),
  loadAudioFile: () => ipcRenderer.invoke("kira:load-audio-file"),
  loadAudioByPath: (path: string) => ipcRenderer.invoke("kira:load-audio-path", path),
  checkFile: (path: string) => ipcRenderer.invoke("kira:check-file", path),
});
