import React, { useState } from "react";
import { makeStyles, Button, IconButton, Paper, Box } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { useSnack, parseError } from "utils";
import LabelItem from "views/ClusterView/components/LabelTaintItem";
import GenericTextField from "components/FormFields/GenericTextField";
import { updateCluster, getEdges } from "actions/index";
import ClusterActionDialog from "./ClusterActionDialog";

const useStyles = makeStyles((theme) => ({
  flexRow: {
    display: "flex",
    "& > *": {
      flex: 1,
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    "&::last-child": {
      marginRight: 0,
      marginBottom: 0,
    },
  },
  flexItem: {
    flex: "0 1 auto",
  },
  cautionText: {
    fontSize: "14px",
    color: "#F44336",
    lineHeight: "1.2",
  },
  messageText: {
    fontSize: "14px",
    color: "#868E96",
    lineHeight: "1.2",
  },
}));

const EditLabelDialog = ({ isOpen, onClose, edge }) => {
  const classes = useStyles();
  const { showSnack } = useSnack();
  const dispatch = useDispatch();
  const metaLabels = edge?.cluster?.metadata?.labels || {};
  const labelKeys = Object.keys(metaLabels);
  const nonDevLabelKeys = labelKeys.filter((x) => !x.includes(".dev/"));
  const nonDevLabels = nonDevLabelKeys.map((key) => {
    return {
      key,
      value: metaLabels[key],
    };
  });
  const [labels, setLabels] = useState(nonDevLabels);

  const isEdgeLabel = (cl) =>
    labels?.find((l) => l.key === cl.meta.key && l.value === cl.meta.value);

  const { clusterLabels, currentProject } = useSelector((state) => {
    return {
      clusterLabels: state.Labels?.clusterLabels?.filter(
        (cl) => !isEdgeLabel(cl),
      ),
      currentProject: state?.Projects?.currentProject,
    };
  });

  const handleExistingLabels = (selectedOption) => {
    const { meta } = selectedOption;
    const { key, value } = meta;
    setLabels([...labels, ...[{ key, value: value || null }]]);
  };

  const addLabel = (item) => {
    setLabels([...labels, ...[item]]);
  };

  const deleteLabel = (index) => {
    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    setLabels(updatedLabels);
  };

  const submit = () => {
    const payload = labels.reduce((acc, curr) => {
      acc[curr.key] = curr.value || "";
      return acc;
    }, {});

    edge.metadata.labels = payload;

    updateCluster(edge)
      .then((res) => {
        if (res.status === 200) {
          dispatch(getEdges(currentProject.metadata.name));
          onClose();
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        showSnack(parseError(err) || "Failed to update labels");
        console.error(err.response?.data);
      });
  };

  const editKeyValueText = (type, index) => (event) => {
    const updatedLabels = [...labels];
    updatedLabels[index][type] = event?.target?.value;
    setLabels(updatedLabels);
  };

  const header = <h2>Edit Cluster's Custom Labels</h2>;

  const content = (
    <Box className="row">
      <div className="col-md-5 pt-0 pr-4">
        <Paper elevation={1} className="mb-3 p-3">
          <h3>Select Existing Labels from the dropdown below:</h3>
          <Select
            menuPlacement="bottom"
            placeholder="Select Existing Labels"
            closeMenuOnSelect
            maxMenuHeight={200}
            options={clusterLabels}
            getOptionLabel={(option) => <LabelItem item={option.meta} />}
            value={null}
            onChange={handleExistingLabels}
          />
        </Paper>
        <h1 className="m-0 d-flex justify-content-center">OR</h1>
        <Paper
          elevation={1}
          className="d-flex align-items-start flex-column mt-3 p-3"
        >
          <h3 className="">Create a New Label</h3>
          <Button
            variant="contained"
            color="primary"
            className="mb-3"
            onClick={() => addLabel({ key: "", value: null })}
          >
            Create Key-Only Label
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => addLabel({ key: "", value: "" })}
          >
            Create Key-Value Label
          </Button>
        </Paper>
      </div>
      <Paper elevation={3} className="col-md-7 pt-3">
        <h2>Assigned Labels</h2>
        {labels.map((label, idx) => {
          return (
            <div key={idx} className={classes.flexRow}>
              <div>
                <GenericTextField
                  required
                  autoFocus
                  size="small"
                  label="Key"
                  onChange={editKeyValueText("key", idx)}
                  value={labels[idx].key}
                  classes={{ root: classes.flexItem }}
                />
              </div>
              {label.value !== null ? (
                <div>
                  <GenericTextField
                    required
                    size="small"
                    label="Value"
                    onChange={editKeyValueText("value", idx)}
                    value={labels[idx].value}
                    classes={{ root: classes.flexItem }}
                  />
                </div>
              ) : (
                <div className="w-100" />
              )}
              <IconButton
                classes={{ root: classes.flexItem }}
                onClick={() => deleteLabel(idx)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          );
        })}
      </Paper>
    </Box>
  );

  return (
    <ClusterActionDialog
      isOpen={isOpen}
      header={header}
      content={content}
      cancelAction={{ onClick: onClose }}
      action={{ onClick: submit, text: "Save" }}
    />
  );
};

export default EditLabelDialog;
