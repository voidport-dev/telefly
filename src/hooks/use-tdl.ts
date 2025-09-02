import { useState } from "react";

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

  const loginWithPhone = () => {};

  const submitAuthCode = () => {};

  const submitPassword = () => {};

  const registerUser = () => {};

  const clearError = () => {};

  const init = async () => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.init();

    if (res.success) {
      setIsInitialized(true);
    } else {
      setError(res.error || "Unknown error");
    }

    setIsLoading(false);
  };

  const getAuthState = () => {};

  return {
    isInitialized,
    isLoading,
    error,
    status,
    loginWithPhone,
    submitAuthCode,
    submitPassword,
    registerUser,
    clearError,
    init,
    getAuthState,
  };
};
