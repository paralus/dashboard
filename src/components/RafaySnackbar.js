import React from "react";
import { Snack } from "utils/useSnack";

const RafaySnackbar = ({
  open = false,
  severity = "error", // error/warning/info/success
  message = "",
  closeCallback,
}) => {
  return (
    <Snack
      open={open}
      severity={severity}
      message={message}
      onClose={closeCallback}
    />
  );
};

export default RafaySnackbar;
