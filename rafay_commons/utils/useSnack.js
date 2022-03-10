import React, { useCallback, useContext, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";

export const SnackContext = React.createContext();

export function Snack({
  title,
  message,
  open,
  severity,
  autoHideDuration,
  onClose
}) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={autoHideDuration || 5000}
      onClose={onClose}
    >
      <Alert
        icon={false}
        severity={severity}
        variant="filled"
        onClose={onClose}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
}

export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [autoHideDuration, setAutoHideDuration] = useState(false);
  const [title, setTitle] = useState(undefined);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const showSnack = useCallback(
    (message, severity = "error", title, autoHideDuration = false) => {
      setOpen(true);
      setTitle(title);
      setMessage(message);
      setSeverity(severity);
      setAutoHideDuration(autoHideDuration);
    },
    []
  );

  return (
    <SnackContext.Provider value={{ showSnack }}>
      {children}
      <Snack
        open={open}
        title={title}
        message={message}
        severity={severity}
        autoHideDuration={autoHideDuration}
        onClose={() => setOpen(false)}
      />
    </SnackContext.Provider>
  );
}

export function useSnack() {
  return useContext(SnackContext);
}
