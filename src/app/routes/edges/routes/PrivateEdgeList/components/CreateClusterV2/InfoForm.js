import React from "react";
import { TextField, Paper } from "@material-ui/core";

const InfoForm = ({
  showForm,
  clusterName,
  description,
  onNameChange,
  onDescChange,
  error,
  clusterType,
  serviceType,
}) => {
  const sEnabled = {
    background: "#f7ffff",
    minHeight: "465px",
  };
  const sDisabled = {
    background: "#f5f5f5",
    minHeight: "465px",
  };
  const errorText = "Duplicate Cluster Name";
  return (
    <Paper
      elevation={showForm ? 3 : 0}
      className="p-3 h-100 mb-2"
      style={showForm ? sEnabled : sDisabled}
    >
      <TextField
        margin="dense"
        required
        id="cluster-name"
        name="cluster-name"
        className="mb-4"
        disabled={!showForm}
        value={clusterName || ""}
        label="Cluster Name"
        onChange={(e) => onNameChange(e.target.value)}
        fullWidth
        error={error}
        helperText={error && errorText}
      />
      <TextField
        multiline
        rows={4}
        variant="outlined"
        margin="dense"
        id="description"
        name="description"
        disabled={!showForm}
        value={description || ""}
        label="Description"
        onChange={(e) => onDescChange(e.target.value)}
        fullWidth
      />
    </Paper>
  );
};

export default InfoForm;
