import React from "react";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const CancelButton = ({ handleClick }) => {
  return (
    <Button variant="contained" onClick={handleClick}>
      <span>Cancel</span>
    </Button>
  );
};

const BackButton = ({ handleClick, disabled }) => {
  return (
    <Button
      variant="contained"
      // color="primary"
      onClick={handleClick}
      disabled={disabled}
    >
      Back
    </Button>
  );
};

const ContinueButton = ({ handleClick, disabled, label }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      className="ml-2"
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

const CreateClusterDialog = ({
  open,
  title,
  handleClose,
  content,
  actions,
}) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        // scroll="paper"
      >
        <DialogTitle style={{ borderBottom: "1px solid lightgrey" }}>
          <span>{title}</span>
          {/* <span
            style={{ float: "right", fontStyle: "italic", fontSize: "smaller" }}
          >
            Cluster Type -
          </span> */}
        </DialogTitle>
        <DialogContent style={{ minHeight: "400px" }}>
          <div className="row">
            <div className="col-md-12 pt-3" style={{ minHeight: "476px" }}>
              {content}
            </div>
          </div>
        </DialogContent>
        <DialogActions
          className="mx-0 p-3"
          style={{ borderTop: "1px solid lightgrey" }}
        >
          <div className="d-flex justify-content-between w-100">
            <div>
              {actions.backButton && (
                <BackButton
                  handleClick={actions.backButton.handleClick}
                  disabled={actions.backButton.disabled}
                />
              )}
            </div>
            <div>
              {actions.cancelButton && (
                <CancelButton handleClick={handleClose} />
              )}
              {actions.continueButton && (
                <ContinueButton
                  handleClick={actions.continueButton.handleClick}
                  disabled={actions.continueButton.disabled}
                  label={actions.continueButton.label}
                />
              )}
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateClusterDialog;
