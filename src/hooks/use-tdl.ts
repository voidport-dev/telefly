import { useCallback, useState } from "react";

export const useTDL = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthState = useCallback(async () => {
    try {
      const result = await window.electronAPI.tdl.getAuthState();

      if (result.error) setError(result.error);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      return { success: false, error: errorMessage };
    }
  }, []);

  const loginWithPhone = useCallback(async (phone: string) => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.loginWithPhone(phone);
    if (res.error) setError(res.error);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return res;
  }, []);

  const submitAuthCode = useCallback(async (code: string) => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.submitAuthCode(code);
    if (res.error) setError(res.error);

    setIsLoading(false);

    return res;
  }, []);

  const submitPassword = useCallback(async (password: string) => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.submitPassword(password);
    if (res.error) setError(res.error);

    setIsLoading(false);

    return res;
  }, []);

  const registerUser = useCallback(async (firstName: string, lastName?: string) => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.registerUser(firstName, lastName);
    if (res.error) setError(res.error);

    setIsLoading(false);

    return res;
  }, []);

  const getPassword = useCallback(async (passwordHint: string) => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.getPassword(passwordHint);
    if (res.error) setError(res.error);

    setIsLoading(false);

    return res;
  }, []);

  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.getCurrentUser();
    if (res.error) setError(res.error);

    setIsLoading(false);

    return res;
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.logout();
    if (res.error) setError(res.error);

    setIsLoading(false);

    if (res.success) {
      setIsInitialized(false);
    } else {
      setError(res.error || "Unknown error");
    }

    return res;
  }, []);

  const init = useCallback(async () => {
    setIsLoading(true);

    const res = await window.electronAPI.tdl.init();
    if (res.error) setError(res.error);

    if (res.success) {
      setIsInitialized(true);
    } else {
      setError(res.error || "Unknown error");
    }

    setIsLoading(false);
  }, []);

  const stepBack = useCallback(async (target: "phone") => {
    setIsLoading(true);
    const res = await window.electronAPI.tdl.stepBack(target);
    if (res.error) setError(res.error);
    setIsLoading(false);
    return res;
  }, []);

  const resendAuthCode = useCallback(async () => {
    setIsLoading(true);
    const res = await window.electronAPI.tdl.resendAuthCode();
    if (res.error) setError(res.error);
    setIsLoading(false);
    return res;
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    loginWithPhone,
    submitAuthCode,
    resendAuthCode,
    submitPassword,
    registerUser,
    init,
    getAuthState,
    getCurrentUser,
    logout,
    getPassword,
    close,
    stepBack,
  };
};
