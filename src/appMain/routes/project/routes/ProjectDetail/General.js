import React, { useEffect, useState } from "react";
import { Paper, TextField, Button } from "@material-ui/core";
import { useParams } from "react-router";
import RafaySnackbar from "components/RafaySnackbar";
import { updateProject } from "actions/index";

const GeneralProject = ({ project }) => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  const closeAlert = (_) => {
    setAlert({
      ...alert,
      show: false,
      message: "",
    });
  };

  const { projectId: id } = useParams();
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [projectDetails, setProjectDetails] = useState({ ...project });
  const { name, description } = projectDetails;

  useEffect(() => {
    setProjectDetails({
      name: project?.metadata.name,
      description: project?.metadata.description,
    });
  }, [project]);

  useEffect(() => {
    const decideDisable = () => {
      const emptyInputs = !name && !description;
      const sameName = name === project?.metadata.name;
      const sameDesc = description === project?.metadata.description;
      const unchangedInputs = sameName && sameDesc;

      if (emptyInputs || unchangedInputs) return true;
      return false;
    };
    const disabled = decideDisable();
    setIsSaveDisabled(disabled);
  }, [name, description, project]);

  const handleChange = ({ target: { name, value } }) => {
    if (name === "description") {
      projectDetails.description = value;
    }
    setProjectDetails({ ...projectDetails });
  };

  const onComponentSave = (_) => {
    project.metadata.description = projectDetails.description;
    updateProject(project.metadata.name, project)
      .then((_) => {
        setAlert({
          show: true,
          message: "Project Details Updated",
          severity: "success",
        });
        setIsSaveDisabled(true);
      })
      .catch((error) => {
        setAlert({
          show: true,
          message: error?.response?.data?.error || "Unexpected Error",
          severity: "error",
        });
      });
  };

  return (
    <Paper className="col-md-6 p-0">
      <div className="p-3">
        <h3>Project Details</h3>
        <div className="row">
          <div className="col-md-6">
            <TextField
              fullWidth
              margin="dense"
              id="name"
              name="name"
              value={name || ""}
              label="Name"
              disabled
              onChange={handleChange}
              size="small"
              error={Number.isInteger(name)}
              variant="standard"
            />
          </div>
          <div className="col-md-12">
            <TextField
              fullWidth
              multiline
              margin="dense"
              id="description"
              name="description"
              value={description || ""}
              label="Description"
              onChange={handleChange}
              size="small"
              error={Number.isInteger(description)}
              variant="standard"
            />
          </div>
        </div>
      </div>
      <div
        className="p-3 mt-2 d-flex flex-row-reverse"
        style={{ borderTop: "1px solid lightgray" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onComponentSave}
          type="submit"
          disabled={isSaveDisabled}
        >
          <span>Save</span>
        </Button>
      </div>
      <RafaySnackbar
        open={alert.show}
        severity={alert.severity}
        message={alert.message}
        closeCallback={closeAlert}
      />
    </Paper>
  );
};

export default GeneralProject;
