import React, { useContext } from "react";
import {
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Paper,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Formik, Form, FastField, FieldArray } from "formik";
import Select from "react-select";
import { useSelector } from "react-redux";
import { LABELS_SCHEMA } from "../../../constants/yup-schemas";
import LabelItem from "./LabelTaintItem";
import { ClusterViewContext } from "../ClusterViewContexts";
import { useSnack } from "utils";

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

function ClusterLabelEditor({ isOpen, onOpen, labels, edge, refreshEdge }) {
  const classes = useStyles();
  const { showSnack } = useSnack();
  const { a } = useContext(ClusterViewContext);
  const IsSystemKey = (key) => key.includes(".dev/");
  const customLabels = labels
    .filter((lb) => !IsSystemKey(lb.key))
    .map((lb) => {
      const { key, value } = lb;
      return { key, value: value || null };
    });

  const isEdgeLabel = (cl) =>
    labels?.find((l) => l.key === cl.meta.key && l.value === cl.meta.value);

  const { clusterLabels, currentProject } = useSelector((state) => {
    return {
      clusterLabels: state.Labels?.clusterLabels?.filter(
        (cl) => !isEdgeLabel(cl)
      ),
      currentProject: state?.Projects?.currentProject,
    };
  });

  const onSubmit = (values) => {
    const { labels } = values;
    const payload = labels.reduce((acc, curr) => {
      acc[curr.key] = curr.value || "";
      return acc;
    }, {});
    if (edge) {
      edge.metadata.labels = payload;
      a.updateCluster(edge)
        .then((res) => {
          if (res.status === 200) {
            if (refreshEdge) refreshEdge();
            onOpen(false);
          } else {
            console.error(res);
          }
        })
        .catch((err) => {
          showSnack("Failed to update labels");
          console.error(err.response?.data);
        });
    }
  };

  const handleExistingLabels = (push) => (selectedOption) => {
    const { meta } = selectedOption;
    const { key, value } = meta;
    push({ key, value: value || null });
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={isOpen}
      onClose={() => onOpen(false)}
      aria-labelledby="cluster-label-editor"
    >
      <DialogTitle
        id="cluster-label-editor"
        style={{ borderBottom: "1px solid lightgray" }}
      >
        Edit Cluster's Custom Labels
        <div>
          <span className={classes.cautionText}>Caution: </span>
          <span className={classes.messageText}>
            Editing or Deleting a Label may impact Workload Placement
          </span>
        </div>
      </DialogTitle>
      <Formik
        initialValues={{ labels: customLabels || [] }}
        validationSchema={LABELS_SCHEMA}
        onSubmit={onSubmit}
      >
        <Form>
          <DialogContent className="py-3">
            <FieldArray name="labels">
              {(fieldArrayProps) => {
                const { push, remove, form } = fieldArrayProps;
                const { values, touched, errors } = form;
                const { labels } = values;
                return (
                  <div style={{ minHeight: "350px" }} className="row">
                    <div className="col-md-5 pt-0 pr-4">
                      <Paper elevation={1} className="mb-3 p-3">
                        <h3>Select Existing Labels from the dropdown below:</h3>
                        <Select
                          menuPlacement="bottom"
                          placeholder="Select Existing Labels"
                          closeMenuOnSelect
                          maxMenuHeight={200}
                          options={clusterLabels}
                          getOptionLabel={(option) => (
                            <LabelItem item={option.meta} />
                          )}
                          value={null}
                          onChange={handleExistingLabels(push)}
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
                          onClick={() => push({ key: "", value: null })}
                        >
                          Create Key-Only Label
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => push({ key: "", value: "" })}
                        >
                          Create Key-Value Label
                        </Button>
                      </Paper>
                    </div>
                    <Paper elevation={3} className="col-md-7 pt-3">
                      <h2>Assigned Labels</h2>
                      {labels.map((label, idx) => {
                        const touchedIdx = touched?.labels?.[idx];
                        const errorIdx = errors?.labels?.[idx];
                        return (
                          <div key={idx} className={classes.flexRow}>
                            <div>
                              <FastField
                                fullWidth
                                required
                                autoFocus
                                size="small"
                                label="Key"
                                as={TextField}
                                name={`labels[${idx}].key`}
                                classes={{ root: classes.flexItem }}
                                error={touchedIdx?.key && errorIdx?.key}
                                helperText={
                                  touchedIdx?.key ? errorIdx?.key : ""
                                }
                              />
                            </div>
                            {label.value !== null ? (
                              <div>
                                <FastField
                                  fullWidth
                                  required
                                  size="small"
                                  label="Value"
                                  as={TextField}
                                  name={`labels[${idx}].value`}
                                  classes={{ root: classes.flexItem }}
                                  error={touchedIdx?.value && errorIdx?.value}
                                  helperText={
                                    touchedIdx?.value ? errorIdx?.value : ""
                                  }
                                />
                              </div>
                            ) : (
                              <div className="w-100" />
                            )}
                            <IconButton
                              classes={{ root: classes.flexItem }}
                              onClick={() => remove(idx)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                        );
                      })}
                    </Paper>
                  </div>
                );
              }}
            </FieldArray>
          </DialogContent>
          <DialogActions style={{ borderTop: "1px solid lightgray" }}>
            <Button onClick={() => onOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
}

export default ClusterLabelEditor;
