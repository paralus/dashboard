import React, { useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Grid,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import * as R from "ramda";

import { FTextField } from "../../components/FormikBindings";
import { generateNewPSPObject } from "./policies-utils";
import PoliciesContext from "./PoliciesContext";
import { useSnack } from "../../utils/useSnack";

const useStyles = makeStyles(theme => ({
  button: {
    letterSpacing: "normal",
    textTransform: "none"
  },
  content: {
    paddingBottom: theme.spacing(3),
    "&:first-child": {
      paddingTop: theme.spacing(1)
    }
  }
}));

const createFormValidationSchema = data => {
  const policyNames = R.map(R.path(["metadata", "name"]), data);

  return Yup.object().shape({
    name: Yup.string()
      .trim()
      .lowercase()
      .required("Required")
      .matches(
        /[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*/,
        "Only lowercase alphanumerics, '-' and '.' are allowed"
      )
      .notOneOf(policyNames, "A policy with this name already exists"),
    description: Yup.string()
      .trim()
      .max(300, "Max 300 characters allowed")
      .matches(
        /[a-zA-Z0-9-. ]*/,
        "Only alphanumerics, spaces, '-' and '.' are allowed"
      )
  });
};

export default function CreatePolicyDialog({
  open,
  data,
  onClose,
  refreshPolicyList,
  history
}) {
  const classes = useStyles();
  const { actions, selectorID } = useContext(PoliciesContext);
  const { showSnack } = useSnack();

  const handleSubmit = (values, { setSubmitting }) => {
    actions
      .create(selectorID, generateNewPSPObject(values))
      .then(refreshPolicyList)
      .then(() => {
        onClose();
        history.push(`/app/policies/edit/${values.name}`);
      })
      .catch(e => {
        setSubmitting(false);
        showSnack(e.response.data?.error);
      });
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle id="form-dialog-title">Create PSP</DialogTitle>
      <Formik
        validateOnMount
        initialValues={{ name: "", description: "" }}
        validationSchema={createFormValidationSchema(data)}
        onSubmit={handleSubmit}
      >
        {props => {
          return (
            <Form>
              <DialogContent className={classes.content}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FTextField
                      fullWidth
                      name="name"
                      label="Name"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FTextField
                      fullWidth
                      multiline
                      rowsMax="4"
                      autoComplete="off"
                      name="description"
                      label="Description"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={onClose}
                  className={classes.button}
                  disabled={props.isSubmitting}
                >
                  CANCEL
                </Button>
                <Button
                  disabled={!props.isValid || props.isSubmitting}
                  className={classes.button}
                  type="submit"
                  color="primary"
                  startIcon={
                    props.isSubmitting && (
                      <CircularProgress size={18} color="inherit" />
                    )
                  }
                >
                  CREATE
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
