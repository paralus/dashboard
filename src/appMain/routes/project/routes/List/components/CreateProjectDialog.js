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

const CreateProjectDialog = ({
  handleCreate,
  handleCreateClose,
  handleProjectChange,
  open,
  project,
}) => {
  return (
    <div>
      <Dialog open={open} onClose={handleCreateClose}>
        <DialogTitle>Add Project</DialogTitle>
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
              value={project.name}
              label="Name"
              onChange={handleProjectChange("name")}
              fullWidth
              validators={["required", "regex"]}
              errorMessages={[
                "this field is required",
                "valid characters are a-zA-Z0-9",
              ]}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              value={project.description}
              onChange={handleProjectChange("description")}
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

export default CreateProjectDialog;
