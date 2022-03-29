import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const CreateResourceDialog = ({
  handleCreate,
  handleCreateClose,
  handleResourceChange,
  open,
  resource,
}) => {
  return (
    <div>
      <Dialog open={open} onClose={handleCreateClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Group</DialogTitle>
        <ValidatorForm
          noValidate
          autoComplete="off"
          onSubmit={handleCreate}
          onError={(errors) => console.log(errors)}
        >
          <DialogContent>
            <TextValidator
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              value={resource.metadata.name}
              label="Name"
              onChange={handleResourceChange("name")}
              fullWidth
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              value={resource.metadata.description}
              onChange={handleResourceChange("description")}
              fullWidth
              name="description"
              rows={3}
            />
          </DialogContent>
          <DialogActions style={{ marginLeft: "65%" }}>
            <Button onClick={handleCreateClose} color="accent">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </div>
  );
};

export default CreateResourceDialog;
