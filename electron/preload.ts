import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: Function) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  tdl: {
    init: () => ipcRenderer.invoke("tdl-init"),
    loginWithPhone: (phone: string) => ipcRenderer.invoke("tdl-login-with-phone", phone),
    submitAuthCode: (code: string) => ipcRenderer.invoke("tdl-submit-auth-code", code),
    resendAuthCode: () => ipcRenderer.invoke("tdl-resend-auth-code"),
    getAuthState: () => ipcRenderer.invoke("tdl-get-auth-state"),
    getCurrentUser: () => ipcRenderer.invoke("tdl-get-current-user"),
    logout: () => ipcRenderer.invoke("tdl-logout"),
    close: () => ipcRenderer.invoke("tdl-close"),
    submitPassword: (password: string) => ipcRenderer.invoke("tdl-submit-password", password),
    registerUser: (firstName: string, lastName?: string) =>
      ipcRenderer.invoke("tdl-register-user", firstName, lastName),
    getPassword: (passwordHint: string) => ipcRenderer.invoke("tdl-get-password", passwordHint),
    stepBack: (target: "phone") => ipcRenderer.invoke("tdl-step-back", target),
  },
});
