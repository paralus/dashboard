import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AppSnackbar from "components/AppSnackbar";
import { createProject } from "actions/index";
import { capitalizeFirstLetter } from "../../../../../../utils";

const NewProject = ({ refreshProjects }) => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false });
  const [project, setProject] = useState({ name: "" });
  const organization = useSelector((state) => state.settings.organization);

  useEffect((_) => {
    ValidatorForm.addValidationRule("regex", (value) => {
      const regex = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

      return regex.test(value);
    });
  }, []);

  const dispatch = useDispatch();

  const handleCreate = () => {
    const success = (_) => {
      setAlert({
        open: true,
        message: "Project Creation Sucessful",
        severity: "success",
      });
      setOpen(false);
      refreshProjects();
    };
    const error = (message) => {
      setAlert({
        open: true,
        message,
        severity: "error",
      });
    };
    dispatch(createProject(project, success, error));
  };
  return (
    <div className="p-3 col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
      <Paper className="p-0">
        <div
          className="d-flex align-items-center"
          style={{ minHeight: "200px" }}
        >
          <div className="d-flex justify-content-center w-100">
            <div className="p-1">
              <Button
                variant="contained"
                className="jr-btn jr-btn-label left text-nowrap text-white"
                onClick={(_) => {
                  setProject({ name: "", description: "" });
                  setOpen(true);
                }}
                style={{ marginRight: 8 }}
                color="primary"
                id="new_group"
                // disabled={buttonDisabled}
              >
                <i className="zmdi zmdi-plus zmdi-hc-fw " />
                <span>New Project</span>
              </Button>
            </div>
          </div>
        </div>
      </Paper>
      <Dialog
        open={open}
        onClose={(_) => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
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
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              fullWidth
              validators={["required", "regex"]}
              errorMessages={[
                "this field is required",
                "valid characters are a-z0-9",
              ]}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              value={project.description}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              fullWidth
              name="description"
              rows={3}
            />
          </DialogContent>
          <DialogActions style={{ marginLeft: "65%" }}>
            <Button onClick={(_) => setOpen(false)} color="default">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
      <AppSnackbar
        open={alert.open}
        severity={alert.severity}
        message={capitalizeFirstLetter(alert.message)}
        closeCallback={(_) => setAlert({ open: false })}
      />
    </div>
  );
};

export default NewProject;
