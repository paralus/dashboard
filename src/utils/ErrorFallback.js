import React, { useEffect } from "react";
import { getWithExpiry, setWithExpiry } from "./storageWithExpiry";

const ErrorFallback = ({ error }) => {
  // Handles failed lazy loading of a JS/CSS chunk.
  console.log("ErrorBoundry error: ", error);
  useEffect(() => {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (error?.message && chunkFailedMessage.test(error.message)) {
      if (!getWithExpiry("chunk_failed")) {
        setWithExpiry("chunk_failed", "true", 10000);
        window.location.reload();
      }
    }
  }, [error]);

  return null;
  // Its possible to show some kind of message here
  // return (
  //   <div>
  //     <p>Something went wrong.</p>
  //     <pre>{error?.message}</pre>
  //   </div>
  // );
};

export default ErrorFallback;
