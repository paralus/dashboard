import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

const TooltipWithDisable = ({ title, disabled, children }) => {
  if (disabled) {
    return <>{children}</>;
  }
  return <Tooltip title={title}>{children}</Tooltip>;
};

const RafayDelete = ({ button }) => {
  const [open, setOpen] = React.useState(false);
  const handleConfirm = () => {
    setOpen(false);
    button.handleClick();
  };
  return (
    <>
      {button.type === "danger-icon" && (
        <TooltipWithDisable title="Delete" disabled={button.disabled}>
          <IconButton
            aria-label="delete"
            className="m-0"
            disabled={button.disabled}
            onClick={() => setOpen(true)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TooltipWithDisable>
      )}
      {button.type === "danger" && (
        <Button
          className={`mr-4 bg-white ${button.disabled ? "" : "text-red"}`}
          dense
          variant="contained"
          color="default"
          disabled={button.disabled}
          onClick={() => setOpen(true)}
        >
          {button.label}
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>{button.confirmText}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="secondary"
            id="user_delete_cancel"
          >
            No
          </Button>
          <Button onClick={handleConfirm} color="primary" id="user_delete_yes">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RafayDelete;
