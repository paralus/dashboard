import React, { useState } from "react";
import { Collapse, IconButton, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(theme => ({
  root: {},
  alert: {}
}));

export default function Banner({
  title,
  message,
  severity,
  closeable = true,
  inline = false,
  classes: _classes
}) {
  const classes = useStyles({ classes: _classes });
  const [open, setOpen] = useState(true);
  const close = (
    <IconButton
      color="inherit"
      size="small"
      onClick={() => {
        setOpen(false);
      }}
    >
      <CloseIcon fontSize="inherit" />
    </IconButton>
  );

  return (
    <Collapse in={open} className={classes.root}>
      <Alert
        severity={severity}
        action={closeable && close}
        className={classes.alert}
        style={{ display: inline ? "inline-flex" : "flex" }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
}
