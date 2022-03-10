import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import PoliciesContext from "./PoliciesContext";
import { useSnack } from "../../utils/useSnack";

const useStyles = makeStyles(theme => ({
  actionBtn: {
    textTransform: "none",
    letterSpacing: "unset"
  },
  deleteBtn: {
    textTransform: "none",
    letterSpacing: "unset",
    backgroundColor: theme.palette.error.dark,
    "&:hover": {
      backgroundColor: theme.palette.error.main
    }
  }
}));

export default function DeletePolicyDialog({
  open,
  pspName,
  onClose,
  refreshPolicyList
}) {
  const classes = useStyles();
  const { showSnack } = useSnack();
  const [loading, setLoading] = useState(false);
  const { actions, selectorID } = useContext(PoliciesContext);

  const handleDelete = () => {
    setLoading(true);
    actions
      .delete(selectorID, pspName)
      .then(refreshPolicyList)
      .then(() => {
        onClose();
        setLoading(false);
      })
      .catch(err => {
        onClose();
        setLoading(false);
        showSnack(err.message);
        console.error(err);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        Are you sure you want to delete <b>{pspName}</b>?
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          className={classes.actionBtn}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          autoFocus
          disableElevation
          className={classes.deleteBtn}
          disabled={loading}
          onClick={handleDelete}
          color="primary"
          variant="contained"
          startIcon={loading && <CircularProgress size={18} color="inherit" />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
