import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    whiteSpace: "unset",
    wordBreak: "break-all",
    padding: "1rem",
    margin: "0.5rem",
  },
  actionBtn: {
    margin: "0.25rem",
    fontWeight: "500",
  },
}));

const RafayConfirmIconAction = ({
  icon,
  buttonText,
  labelText,
  action,
  confirmText,
  tooltip,
  buttonParams = {},
  disabled,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleConfirm = () => {
    setOpen(false);
    action();
  };

  return (
    <>
      {icon && !disabled && (
        <Tooltip title={tooltip || ""}>
          <IconButton
            aria-label="confirm_action"
            className="m-0"
            onClick={() => setOpen(true)}
            disabled={disabled}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )}
      {icon && disabled && (
        <IconButton
          aria-label="confirm_action"
          className="m-0"
          disabled={disabled}
        >
          {icon}
        </IconButton>
      )}
      {buttonText && (
        <Button
          className={classes.btnPadding}
          variant="contained"
          color="primary"
          disabled={disabled}
          {...buttonParams}
          onClick={() => setOpen(true)}
        >
          {buttonText}
        </Button>
      )}
      {labelText && (
        <div disabled={disabled} onClick={() => setOpen(true)}>
          {labelText}
        </div>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          {confirmText}
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.actionBtn}
            onClick={() => setOpen(false)}
            color="secondary"
            id="delete_cancel"
          >
            No
          </Button>
          <Button
            className={classes.actionBtn}
            onClick={handleConfirm}
            color="primary"
            id="delete_yes"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RafayConfirmIconAction;
