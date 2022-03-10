import React from "react";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";

const EditLocation = ({ open, locationField, handleClose, handleSave }) => {
  if (!open) return null;

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>
          <span>Edit Location</span>
        </DialogTitle>
        <DialogContent>
          <div className="mt-4" style={{ minHeight: "300px" }}>
            <div className="row">
              <div className="col-md-12">{locationField}</div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditLocation;
