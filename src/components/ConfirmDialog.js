import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => {
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md">
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={onConfirm}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDialog;
