import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    // textTransform: "none",
    // letterSpacing: 0
    // borderRadius: 2
  },
  buttonWithStartIcon: {
    textTransform: "none",
    letterSpacing: 0,
    padding: 0,
    paddingRight: 12,
    borderRadius: 2
  },
  startIcon: {
    padding: "8px 6px",
    marginLeft: 0,
    borderRadius: "4px 0 0 4px",
    backgroundColor: "rgba(255, 255, 255, 0.25)"
  }
}));

export default function RButton({ classes: _classes, children, ...rest }) {
  const classes = useStyles({ classes: _classes });

  return (
    <Button
      classes={{
        root: rest.startIcon ? classes.buttonWithStartIcon : classes.button,
        startIcon: classes.startIcon
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
