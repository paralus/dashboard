import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import React from "react";

const useStyles = makeStyles((theme) => ({
  spinnerWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  spinnerInner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    pointerEvents: "none",
    borderRadius: 4,
    zIndex: 1300,
    userSelect: "none",
  },
  content: {
    zIndex: 1,
    height: "100%",
  },
  loading: {
    pointerEvents: "none",
    userSelect: "none",
  },
  static: {
    height: "300px",
  },
}));

export default function Spinner({
  hideChildren,
  component,
  children,
  loading,
  classes: _classes,
  addHeight,
}) {
  const classes = useStyles({ classes: _classes });
  const contentClasses = classnames(classes.content, {
    [classes.loading]: loading,
  });
  return (
    <div className={classes.spinnerWrapper}>
      {loading && (
        <div className={classes.spinnerInner}>
          {component || <CircularProgress />}
        </div>
      )}
      <div className={contentClasses}>
        {loading && hideChildren ? (
          addHeight ? (
            <div className={classes.static} />
          ) : null
        ) : (
          children
        )}
      </div>
    </div>
  );
}
