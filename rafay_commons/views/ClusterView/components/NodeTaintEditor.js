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
  MenuItem,
  Paper
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Formik, Form, FastField, FieldArray } from "formik";
import { useSelector } from "react-redux";
import { TAINTS_SCHEMA } from "../../../constants/yup-schemas";
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

function NodeTaintEditor({ isOpen, onOpen, node, onRefresh }) {
  if (!node) return null;
  const classes = useStyles();
  const { a, edge } = useContext(ClusterViewContext);
  const currentProject = useSelector(state => state.Projects.currentProject);

  const taints = node?.spec?.taints || [];
  const nodeTaints = taints.map(taint => {
    const { key, value, effect } = taint;
    return { key, value: value || null, effect };
  });

  const onSubmit = values => {
    const { taints } = values;
    const taintsArray = taints.map(taint => {
      const { key, value, effect } = taint;
      return { key, value: value || "", effect };
    });

    node.spec.taints = taintsArray;

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
      aria-labelledby="node-taint-editor"
    >
      <DialogTitle
        id="node-taint-editor"
        style={{ borderBottom: "1px solid lightgray" }}
      >
        Edit Node's Custom Taints
      </DialogTitle>
      <Formik
        initialValues={{ taints: nodeTaints || [] }}
        validationSchema={TAINTS_SCHEMA}
        onSubmit={onSubmit}
      >
        <Form>
          <DialogContent className="p-4">
            <FieldArray name="taints">
              {fieldArrayProps => {
                const { push, remove, form } = fieldArrayProps;
                const { values, touched, errors } = form;
                const { taints } = values;
                return (
                  <div style={{ minHeight: "350px" }} className="row">
                    <div className="col-md-5 pt-0 pl-2 pr-4">
                      <Paper
                        elevation={1}
                        className="d-flex align-items-start flex-column p-3"
                      >
                        <h3 className="">Create a New Taint</h3>
                        <Button
                          variant="contained"
                          color="primary"
                          className="mb-3"
                          onClick={() =>
                            push({
                              key: "",
                              value: null,
                              effect: "PreferNoSchedule"
                            })
                          }
                        >
                          Create Key-Effect Taint
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            push({
                              key: "",
                              value: "",
                              effect: "PreferNoSchedule"
                            })
                          }
                        >
                          Create Key-Value-Effect Taint
                        </Button>
                      </Paper>
                    </div>
                    <Paper elevation={3} className="col-md-7 pt-3 pr-2">
                      <h2>Assigned Taints</h2>
                      {taints.map((label, idx) => {
                        const touchedIdx = touched?.taints?.[idx];
                        const errorIdx = errors?.taints?.[idx];
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
                                name={`taints[${idx}].key`}
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
                                  name={`taints[${idx}].value`}
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
                            <div>
                              <FastField
                                select
                                fullWidth
                                size="small"
                                label="Effect"
                                as={TextField}
                                name={`taints[${idx}].effect`}
                                classes={{ root: classes.flexItem }}
                                error={touchedIdx?.effect && !!errorIdx?.effect}
                                helperText={
                                  touchedIdx?.effect && errorIdx?.effect
                                }
                              >
                                {[
                                  "PreferNoSchedule",
                                  "NoSchedule",
                                  "NoExecute"
                                ].map(x => (
                                  <MenuItem key={x} value={x}>
                                    {x}
                                  </MenuItem>
                                ))}
                              </FastField>
                            </div>
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

export default NodeTaintEditor;
