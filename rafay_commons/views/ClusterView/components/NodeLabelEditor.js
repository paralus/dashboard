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
  Paper
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Formik, Form, FastField, FieldArray } from "formik";
import { useSelector } from "react-redux";
import { LABELS_SCHEMA } from "../../../constants/yup-schemas";
import { ClusterViewContext } from "../ClusterViewContexts";

const useStyles = makeStyles(theme => ({
  flexRow: {
    display: "flex",
    "& > *": {
      flex: 1,
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    "&::last-child": {
      marginRight: 0,
      marginBottom: 0
    }
  },
  flexItem: {
    flex: "0 1 auto"
  }
}));

function NodeLabelEditor({ isOpen, onOpen, node, onRefresh }) {
  if (!node) return null;
  const classes = useStyles();
  const { a, edge } = useContext(ClusterViewContext);
  const currentProject = useSelector(state => state.Projects.currentProject);
  const IsSystemKey = key => key.includes(".dev/");

  const nodeLabelObject = node?.metadata?.labels || {};
  const nodeLabelsArray = Object.entries(nodeLabelObject);
  const nodeLabels = nodeLabelsArray.reduce((acc, curr) => {
    const [key, value] = curr;
    if (IsSystemKey(key)) return acc;
    acc.push({ key, value: value || null });
    return acc;
  }, []);

  const onSubmit = values => {
    const { labels } = values;
    const labelObject = labels.reduce((acc, curr) => {
      acc[curr.key] = curr.value || "";
      return acc;
    }, {});

    const originalLabels = node.metadata.labels || {};
    const filteredSystemLabels = Object.entries(originalLabels).filter(x =>
      IsSystemKey(x[0])
    );
    const systemLabels = Object.fromEntries(filteredSystemLabels);
    node.metadata.labels = { ...systemLabels, ...labelObject };

    const payload = { items: [] };
    payload.items.push(node);

    a.updateNodeLabelandTaints(currentProject.id, edge.name, payload)
      .then(res => {
        if (res.status === 200) {
          onOpen(false);
          onRefresh(true);
        } else {
          console.error(res);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={isOpen}
      onClose={() => onOpen(false)}
      aria-labelledby="node-label-editor"
    >
      <DialogTitle
        id="node-label-editor"
        style={{ borderBottom: "1px solid lightgray" }}
      >
        Edit Node's Custom Labels
      </DialogTitle>
      <Formik
        initialValues={{ labels: nodeLabels || [] }}
        validationSchema={LABELS_SCHEMA}
        onSubmit={onSubmit}
      >
        <Form>
          <DialogContent className="py-3">
            <FieldArray name="labels">
              {fieldArrayProps => {
                const { push, remove, form } = fieldArrayProps;
                const { values, touched, errors } = form;
                const { labels } = values;
                return (
                  <div style={{ minHeight: "350px" }} className="row">
                    <div className="col-md-5 pt-0 pr-4">
                      <Paper
                        elevation={1}
                        className="d-flex align-items-start flex-column p-3"
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
                                error={touchedIdx?.key && !!errorIdx?.key}
                                helperText={touchedIdx?.key && errorIdx?.key}
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
                                  error={touchedIdx?.value && !!errorIdx?.value}
                                  helperText={
                                    touchedIdx?.value && errorIdx?.value
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

export default NodeLabelEditor;
