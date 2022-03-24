import React from "react";
import { makeStyles, Button, TextField, Paper } from "@material-ui/core";
import { Formik, Form, FastField, FieldArray } from "formik";
import { TAGS_SCHEMA } from "constants/yup-schemas";
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

function KeyValueField({ name, label, type, value, onSubmit, isEdit }) {
  if (!value) return null;

  const classes = useStyles();
  const handleOnSubmit = (values) => {
    const { labels } = values;
    const labelsObject = transformLabelsArray(labels);
    onSubmit(name, labelsObject);
  };

  const labelsArray = transformLabelsObject(value);
  const editableTags = labelsArray.filter((tag) => !tag.key.startsWith("aws/"));

  return (
    <Formik
      initialValues={{ labels: editableTags }}
      validationSchema={TAGS_SCHEMA}
      onSubmit={handleOnSubmit}
    >
      <Form>
        <FieldArray name="labels">
          {(fieldArrayProps) => {
            const { push, remove, form } = fieldArrayProps;
            const { values, touched, errors, handleSubmit } = form;
            const { labels } = values;
            return (
              <Paper className="row my-3 mx-0" onMouseLeave={handleSubmit}>
                <h4 className="col-md-12 mb-0 mt-2">{label}</h4>
                <div className="col-md-12">
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
                            helperText={touchedIdx?.key ? errorIdx?.key : ""}
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
                    <div className="my-2">
                      <Button
                        className="pl-0"
                        color="primary"
                        onClick={() => push({ key: "", value: "" })}
                      >
                        <i className="zmdi zmdi-plus zmdi-hc-fw " />
                        <span>Add Key-Value {type}</span>
                      </Button>
                    </div>
                  )}
                </div>
              </Paper>
            );
          }}
        </FieldArray>
      </Form>
    </Formik>
  );
}

export default KeyValueField;
