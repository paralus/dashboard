import React, { useState } from "react";
import { makeStyles, Button, TextField, Paper } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Formik, Form, FastField, FieldArray } from "formik";
import { LABELS_SCHEMA } from "constants/yup-schemas";
import { transformLabelsArray, transformLabelsObject } from "utils/helpers";

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
    "&::first-child": {
      marginLeft: 0,
    },
  },
  flexIcon: {
    flex: "0 0 auto",
    marginTop: 20,
  },
}));

function KeyValueField({
  name,
  label,
  type,
  addLabel,
  value,
  onSubmit,
  isEdit,
  hideKeyOnly,
  collapsable,
  disabled,
  doNotValidate,
}) {
  if (!value) return null;

  const classes = useStyles();
  const handleOnSubmit = (values) => {
    const { labels } = values;
    const labelsObject = transformLabelsArray(labels);
    onSubmit(name, labelsObject);
  };

  const labelsArray = transformLabelsObject(value);
  const [open, setOpen] = useState(false);

  const CollapsableCard = ({ label, children }) => {
    return (
      <Paper elevation={3} className="p-3">
        <h3
          style={{ color: "teal", cursor: "pointer" }}
          onClick={(_) => setOpen(!open)}
        >
          <span className="mr-2">{label}</span>
          {open ? (
            <i className="zmdi zmdi-chevron-down zmdi-hc-lg" />
          ) : (
            <i className="zmdi zmdi-chevron-right zmdi-hc-lg" />
          )}
        </h3>
        <div className={open ? "" : "d-none"}>{children}</div>
      </Paper>
    );
  };

  const Wrapper = ({ collapsable, onMouseLeave, children }) => {
    if (collapsable) {
      return (
        <CollapsableCard label={label}>
          <div onMouseLeave={onMouseLeave}>{children}</div>
        </CollapsableCard>
      );
    }
    return (
      <Paper className="row py-3 mx-0" onMouseLeave={onMouseLeave}>
        {label && <h4 className="col-md-12 mb-3 mt-3">{label}</h4>}
        <div className="px-3 w-100">{children}</div>
      </Paper>
    );
  };

  return (
    <Formik
      initialValues={{ labels: labelsArray }}
      validationSchema={!doNotValidate && LABELS_SCHEMA}
      onSubmit={handleOnSubmit}
    >
      <Form>
        <FieldArray name="labels">
          {(fieldArrayProps) => {
            const { push, remove, form } = fieldArrayProps;
            const { values, touched, errors, handleSubmit } = form;
            const { labels } = values;
            return (
              <Wrapper collapsable={collapsable} onMouseLeave={handleSubmit}>
                <div className="col-md-12 px-0">
                  {labels.map((label, idx) => {
                    const touchedIdx = touched?.labels?.[idx];
                    const errorIdx = errors?.labels?.[idx];
                    return (
                      <div key={idx} className={classes.flexRow}>
                        <div>
                          <FastField
                            fullWidth
                            required
                            // autoFocus
                            size="small"
                            label="Key"
                            as={TextField}
                            name={`labels[${idx}].key`}
                            classes={{ root: classes.flexItem }}
                            error={touchedIdx?.key && !!errorIdx?.key}
                            helperText={touchedIdx?.key && errorIdx?.key}
                            disabled={disabled}
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
                              helperText={touchedIdx?.value && errorIdx?.value}
                              disabled={disabled}
                            />
                          </div>
                        ) : (
                          <div className="w-100" />
                        )}
                        {!isEdit && (
                          <div className={classes.flexIcon}>
                            <i
                              className="zmdi zmdi-delete zmdi-hc-2x "
                              onClick={() => remove(idx)}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!isEdit && (
                    <div className="mt-2">
                      <Button
                        className="mr-3 mb-2"
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          push({ key: "", value: "" });
                        }}
                        disabled={disabled}
                      >
                        {addLabel ? (
                          <span>{addLabel}</span>
                        ) : (
                          <span>Add Key-Value {type}</span>
                        )}
                      </Button>
                      {!hideKeyOnly && (
                        <Button
                          className="mb-2"
                          color="primary"
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => push({ key: "", value: null })}
                          disabled={disabled}
                        >
                          <span>Add Key-Only {type}</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Wrapper>
            );
          }}
        </FieldArray>
      </Form>
    </Formik>
  );
}

export default KeyValueField;
