import React, { useEffect, useState, useRef } from "react";
import { TextField, Paper, Button, Switch } from "@material-ui/core";
import RafaySnackbar from "components/RafaySnackbar";
import { updateOragnization } from "actions/index";
import * as R from "ramda";
import { capitalizeFirstLetter } from "../../../../utils";

function LockoutSetting({ organization }) {
  const [lockout, setLockout] = useState({ enabled: false });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const savedValueRef = useRef(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    setLockout(organization.spec.settings?.lockout);
  }, [organization]);

  useEffect(() => {
    const isNotChanged = R.equals(savedValueRef.current, lockout);
    setIsSaveDisabled(isNotChanged);
  }, [lockout]);

  const closeAlert = (_) => {
    setAlert({
      ...alert,
      show: false,
      message: "",
    });
  };
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === "lockout_enabled") {
      lockout.enabled = checked;
    }
    if (name === "lockout_period_min") {
      lockout.period_min = Number(value);
    }
    if (name === "invalid_attempts_limit") {
      lockout.attempts = Number(value);
    }
    setLockout({ ...lockout });
  };

  const handleSave = (_) => {
    organization.spec.settings.lockout = lockout;
    updateOragnization(organization)
      .then((_) => {
        setAlert({
          show: true,
          message: "Lockout Settings Updated",
          severity: "success",
        });
        setIsSaveDisabled(true);
      })
      .catch((error) => {
        setAlert({
          show: true,
          message: error?.response?.data?.error || "Unexpected Error",
          severity: "error",
        });
      });
  };

  return (
    <Paper className="col-md-6 p-0">
      <div className="p-3">
        <h3>Lockout Settings</h3>
        <p style={{ color: "gray" }}>
          User will be automatically locked out after specific number of
          consecutive, unsuccessful attempts in specified time period.
        </p>
        <div className="row">
          <div className="col-md-4 py-2">Lockout Configuration</div>
          <div className="col-md-6">
            <Switch
              id="gpu_enabled"
              color="primary"
              name="lockout_enabled"
              checked={lockout?.enabled}
              onChange={handleChange}
            />
            <span className="ml-3">
              {lockout?.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
        {lockout?.enabled ? (
          <div className="row">
            <div className="col-6">
              <p className="text-muted">Set lockout period minutes</p>
              <TextField
                margin="dense"
                id="lockout_period_min"
                name="lockout_period_min"
                value={lockout?.period_min}
                label="Minutes"
                onChange={handleChange}
                size="small"
                error={!Number.isInteger(lockout?.period_min)}
                variant="outlined"
              />
            </div>
            <div className="col-6">
              <p className="text-muted">Set invalid attempts limit</p>
              <TextField
                margin="dense"
                id="invalid_attempts_limit"
                name="invalid_attempts_limit"
                value={lockout?.attempts}
                label="Attempts"
                onChange={handleChange}
                size="small"
                error={!Number.isInteger(lockout?.attempts)}
                variant="outlined"
              />
            </div>
          </div>
        ) : null}
      </div>
      <div
        className="p-3 mt-2 d-flex flex-row-reverse"
        style={{ borderTop: "1px solid lightgray" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          type="submit"
          disabled={isSaveDisabled}
        >
          <span>Save</span>
        </Button>
      </div>
      <RafaySnackbar
        open={alert.show}
        severity={alert.severity}
        message={capitalizeFirstLetter(alert.message)}
        closeCallback={closeAlert}
      />
    </Paper>
  );
}

export default LockoutSetting;
