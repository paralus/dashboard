import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((_) => ({
  content: {
    height: "350px",
    overflow: "hidden",
  },
}));

export default function DrawerWrapper({ children }) {
  const classes = useStyles();

  return (
    <Drawer anchor="bottom" open variant="persistent">
      <div className={classes.content}>{children}</div>
    </Drawer>
  );
}
