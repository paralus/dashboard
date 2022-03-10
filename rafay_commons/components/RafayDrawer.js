import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Drawer, makeStyles, Paper } from "@material-ui/core";
import Spinner from "./Spinner";
import IfThen from "../views/ClusterView/components/IfThen";

const useStyles = makeStyles(() => ({
  paper80: {
    maxWidth: "85%"
  }
}));

function PaperConditional({ showPaper, children }) {
  return (
    <>
      <IfThen condition={showPaper}>
        <Paper style={{ minHeight: 150 }}>{children}</Paper>
      </IfThen>
      <IfThen condition={!showPaper}>{children}</IfThen>
    </>
  );
}

function SpinnerConditional({ showSpinner, children, loading }) {
  return (
    <>
      <IfThen condition={showSpinner}>
        <Spinner loading={loading}>{children}</Spinner>
      </IfThen>
      <IfThen condition={!showSpinner}>{children}</IfThen>
    </>
  );
}

export default function RafayDrawer(props) {
  const {
    open,
    onClose,
    children,
    anchor,
    headerText,
    subHeaderText,
    showSpinner,
    showPaper,
    loading,
    hideHeader,
    restrictFullWidth,
    onBack
  } = props;

  const classes = useStyles();

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      classes={{ paper: restrictFullWidth ? classes.paper80 : "" }}
    >
      {!hideHeader && (
        <div
          style={{
            padding: "1rem",
            background: "rgb(222, 243, 241)",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          {onBack && (
            <ArrowBackIcon style={{ cursor: "pointer" }} onClick={onBack} />
          )}

          <h3 style={{ margin: 0, fontWeight: 700 }}>
            {headerText}
            {subHeaderText && (
              <span style={{ color: "teal" }}> {subHeaderText}</span>
            )}
          </h3>

          <CloseIcon style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
      )}

      <PaperConditional showPaper={showPaper}>
        <SpinnerConditional showSpinner={showSpinner} loading={loading}>
          {children}
        </SpinnerConditional>
      </PaperConditional>
    </Drawer>
  );
}
