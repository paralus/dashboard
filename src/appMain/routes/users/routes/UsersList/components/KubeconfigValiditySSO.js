import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { getKubeconfigValidity, setKubeconfigValidity } from "actions/index";

const KubeconfigValiditySSO = ({ open, user, onClose, setAlert }) => {
  if (!open) return null;
  if (!user) return null;
  const userId = user.metadata.id;
  const userName = user.metadata.name;
  const getHours = (seconds) => {
    return Math.round(seconds / (60 * 60));
  };
  const [hours, setHours] = useState(0);
  const [sessionCheck, setSessionCheck] = useState(false);
  const onHoursChange = (e) => {
    const val = Number.parseInt(e.target.value, 10);
    if (Number.isNaN(val)) {
      setHours("");
      return;
    }
    setHours(val);
  };
  const onComponentSave = (_) => {
    const seconds = hours * 60 * 60;
    setKubeconfigValidity(
      userId,
      {
        validitySeconds: Number.parseInt(seconds, 10),
        enableSessionCheck: sessionCheck,
      },
      true,
    )
      .then((_) => {
        setAlert({
          showAlert: true,
          alertMessage: `Kubeconfig Validity Updated for ${userName}`,
          alertSeverity: "success",
        });
        onClose();
      })
      .catch((error) => {
        setAlert({
          showAlert: true,
          alertMessage: error?.response?.data?.message || "Unexpected Error",
          alertSeverity: "error",
        });
        onClose();
      });
  };

  useEffect((_) => {
    getKubeconfigValidity(userId, true).then((res) => {
      if (res?.data?.validitySeconds) {
        setHours(getHours(res?.data?.validitySeconds));
        setSessionCheck(res?.data?.enableSessionCheck);
      }
    });
  }, []);
  return (
    <Dialog open={open || false} maxWidth="sm" fullWidth>
      <DialogTitle style={{ borderBottom: "1px solid lightgray" }}>
        KubeCTL Settings
      </DialogTitle>
      <DialogContent>
        <div className="col-md-12 p-0">
          <div className="p-3">
            <div className="col d-flex flex-column pl-0">
              <div>
                <p className="text-muted">
                  Set Kubeconfig's validity period for <b>{userName}</b>
                </p>
                <TextField
                  margin="dense"
                  id="seconds"
                  name="seconds"
                  value={hours}
                  label="Hours"
                  onChange={onHoursChange}
                  size="small"
                  error={!Number.isInteger(hours)}
                  variant="outlined"
                />
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sessionCheck}
                      onChange={(e) => setSessionCheck(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Require console login before kubectl access"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions style={{ borderTop: "1px solid lightgray" }}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onComponentSave}
          type="submit"
        >
          <span>Save</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KubeconfigValiditySSO;
