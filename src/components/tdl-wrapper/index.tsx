import React, { useEffect, useState } from "react";

import { useTDL } from "../../hooks/useTDL";

export const TDLWrapper = ({ children }: { children: React.ReactNode }) => {
  const { init, isInitialized, error, isLoading } = useTDL();
  const [initAttempted, setInitAttempted] = useState(false);

  useEffect(() => {
    const initializeTDL = async () => {
      if (!initAttempted) {
        setInitAttempted(true);
        const result = await init();
        if (result.success) {
          console.info("TDL initialized successfully");
        } else {
          console.error("TDL initialization failed:", result.error);
        }
      }
    };

    initializeTDL();
  }, [init, initAttempted]);

  if (isLoading) {
    return <div>Initializing TDL...</div>;
  }

  if (error && !isInitialized) {
    return <div>Failed to initialize TDL: {error}</div>;
  }

  if (!isInitialized) {
    return <div>Waiting for TDL initialization...</div>;
  }

  return <>{children}</>;
};
