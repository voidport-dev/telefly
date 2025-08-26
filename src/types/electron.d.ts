declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data: any) => void;
      receive: (channel: string, func: Function) => void;
      tdl: {
        init: (apiId?: number, apiHash?: string) => Promise<{ success: boolean; error?: string }>;
        initDefault: () => Promise<{ success: boolean; error?: string }>;
        loginWithPhone: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
        getAuthCode: () => Promise<{ success: boolean; error?: string }>;
        submitAuthCode: (code: string) => Promise<{ success: boolean; error?: string }>;
        getPassword: (passwordHint: string) => Promise<{ success: boolean; error?: string }>;
        submitPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
        registerUser: (
          firstName: string,
          lastName?: string,
        ) => Promise<{ success: boolean; error?: string }>;
        getStatus: () => Promise<{ success: boolean; status?: string; error?: string; user?: any }>;
        getAuthState: () => Promise<{ success: boolean; authState?: string; error?: string }>;
        getCurrentUser: () => Promise<{
          success: boolean;
          user?: {
            id: number;
            firstName: string;
            lastName?: string;
            username?: string;
            phoneNumber?: string;
            isVerified: boolean;
            isPremium: boolean;
            status?: string;
            profilePhoto?: any;
          };
          error?: string;
        }>;
        close: () => Promise<{ success: boolean; error?: string }>;
        logout: () => Promise<{ success: boolean; error?: string }>;
        getAppInfo: () => Promise<{
          success: boolean;
          apiId?: number;
          apiHash?: string;
          appTitle?: string;
          appShortName?: string;
          isInitialized?: boolean;
          error?: string;
        }>;
        reset: () => Promise<{ success: boolean; error?: string }>;
      };
    };
  }
}

export {};
