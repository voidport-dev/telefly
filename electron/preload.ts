import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: Function) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  tdl: {
    init: (apiId?: number, apiHash?: string) => ipcRenderer.invoke("tdl-init", apiId, apiHash),
    initDefault: () => ipcRenderer.invoke("tdl-init-default"),
    loginWithPhone: (phoneNumber: string) => ipcRenderer.invoke("tdl-login-phone", phoneNumber),
    getAuthCode: () => ipcRenderer.invoke("tdl-get-auth-code"),
    submitAuthCode: (code: string) => ipcRenderer.invoke("tdl-submit-auth-code", code),
    getPassword: (passwordHint: string) => ipcRenderer.invoke("tdl-get-password", passwordHint),
    submitPassword: (password: string) => ipcRenderer.invoke("tdl-submit-password", password),
    registerUser: (firstName: string, lastName?: string) =>
      ipcRenderer.invoke("tdl-register-user", firstName, lastName),
    getStatus: () => ipcRenderer.invoke("tdl-get-status"),
    getAuthState: () => ipcRenderer.invoke("tdl-get-auth-state"),
    getCurrentUser: () => ipcRenderer.invoke("tdl-get-current-user"),
    close: () => ipcRenderer.invoke("tdl-close"),
    logout: () => ipcRenderer.invoke("tdl-logout"),
    getAppInfo: () => ipcRenderer.invoke("tdl-get-app-info"),
    reset: () => ipcRenderer.invoke("tdl-reset"),
  },
});
