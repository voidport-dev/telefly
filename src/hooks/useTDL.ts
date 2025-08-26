import { useState, useCallback } from "react";

interface TDLStatus {
  success: boolean;
  status?: string;
  error?: string;
  user?: any;
}

interface TDLResponse {
  success: boolean;
  error?: string;
}

export const useTDL = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<TDLStatus | null>(null);

  const init = useCallback(async (apiId?: number, apiHash?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.init(apiId, apiHash);
      if (result.success) {
        setIsInitialized(true);
        return result;
      } else {
        setError(result.error || "Failed to initialize TDL");
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initDefault = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.initDefault();
      if (result.success) {
        setIsInitialized(true);
        return result;
      } else {
        setError(result.error || "Failed to initialize TDL with default credentials");
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithPhone = useCallback(async (phoneNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.loginWithPhone(phoneNumber);
      if (!result.success) {
        setError(result.error || "Failed to login with phone number");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuthCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.getAuthCode();
      if (!result.success) {
        setError(result.error || "Failed to get auth code");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAuthCode = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.submitAuthCode(code);
      if (!result.success) {
        const resetResult = await window.electronAPI.tdl.reset();
        if (resetResult.success) {
          const initResult = await window.electronAPI.tdl.initDefault();
          if (initResult.success) {
            const retry = await window.electronAPI.tdl.submitAuthCode(code);
            if (!retry.success) {
              setError(retry.error || "Failed to submit auth code");
              return retry;
            }
            return retry;
          }
        }
        setError(result.error || "Failed to submit auth code");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPassword = useCallback(async (passwordHint: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.getPassword(passwordHint);
      if (!result.success) {
        setError(result.error || "Failed to get password");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.submitPassword(password);
      if (!result.success) {
        setError(result.error || "Failed to submit password");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (firstName: string, lastName?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.registerUser(firstName, lastName);
      if (!result.success) {
        setError(result.error || "Failed to register user");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.getStatus();
      setStatus(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuthState = useCallback(async () => {
    try {
      const result = await window.electronAPI.tdl.getAuthState();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      return { success: false, error: errorMessage };
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const result = await window.electronAPI.tdl.getCurrentUser();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      return { success: false, error: errorMessage };
    }
  }, []);

  const close = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.close();
      if (result.success) {
        setIsInitialized(false);
        setStatus(null);
      } else {
        setError(result.error || "Failed to close TDL");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.logout();
      if (result.success) {
        setIsInitialized(false);
        setStatus(null);
      } else {
        setError(result.error || "Failed to logout from TDL");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await window.electronAPI.tdl.reset();
      if (result.success) {
        setIsInitialized(false);
        setStatus(null);
      } else {
        setError(result.error || "Failed to reset TDL");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    status,
    init,
    initDefault,
    loginWithPhone,
    getAuthCode,
    submitAuthCode,
    getPassword,
    submitPassword,
    registerUser,
    getStatus,
    getAuthState,
    getCurrentUser,
    close,
    logout,
    reset,
    clearError,
  };
};
