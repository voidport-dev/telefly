declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data: any) => void;
      receive: (channel: string, func: Function) => void;
      tdl: {
        init: (apiId?: number, apiHash?: string) => Promise<{ success: boolean; error?: string }>;
        initDefault: () => Promise<{ success: boolean; error?: string }>;
        loginWithPhone: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
        submitAuthCode: (code: string) => Promise<{ success: boolean; error?: string }>;
        getAuthState: () => Promise<{ success: boolean; data?: any; error?: string }>;
        getCurrentUser: () => Promise<{ success: boolean; data?: any; error?: string }>;
        logout: () => Promise<{ success: boolean; error?: string }>;
        close: () => Promise<{ success: boolean; error?: string }>;
        submitPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
        registerUser: (
          firstName: string,
          lastName?: string,
        ) => Promise<{ success: boolean; error?: string }>;
        getPassword: (passwordHint: string) => Promise<{ success: boolean; error?: string }>;
      };
    };
  }
}

export {};
