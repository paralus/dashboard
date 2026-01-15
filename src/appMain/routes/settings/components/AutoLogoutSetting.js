import React, { useEffect, useState, useRef } from "react";
import { TextField, Paper, Button, Switch } from "@material-ui/core";
import AppSnackbar from "components/AppSnackbar";
import { updateOragnization } from "actions/index";
import * as R from "ramda";
import { capitalizeFirstLetter } from "../../../../utils";

function AutoLogoutSetting({ partner, organization }) {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  const [idleLogoutTime, setIdleLogoutTime] = useState(
    organization.spec?.settings?.idleLogoutMin,
  );
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const savedValueRef = useRef(null);

  useEffect(() => {
    const isNotChanged = R.equals(savedValueRef.current, idleLogoutTime);
    setIsSaveDisabled(isNotChanged);
  }, [idleLogoutTime]);

  const closeAlert = (_) => {
    setAlert({
      ...alert,
      show: false,
      message: "",
    });
  };
  const handleChange = (event) => {
    setIdleLogoutTime(Number(event.target.value));
  };

  const handleSave = (_) => {
    if (organization.spec.settings) {
      organization.spec.settings.idleLogoutMin = idleLogoutTime;
    } else {
      organization.spec.settings = { idleLogoutMin: idleLogoutTime };
    }

    updateOragnization(organization)
      .then((_) => {
        setAlert({
          show: true,
          message: "Auto Logout Settings Updated",
          severity: "success",
        });
        setIsSaveDisabled(true);
        savedValueRef.current = idleLogoutTime;
      })
      .catch((error) => {
        setAlert({
          show: true,
          message:
            (error?.response?.data?.details &&
              error?.response?.data?.details[0]?.detail) ||
            "Unexpected Error",
          severity: "error",
        });
      });
  };

  return (
    <Paper className="col-md-6 p-0">
      <div className="p-3">
        <h3>Auto Logout Settings</h3>
        <p style={{ color: "gray" }}>
          User will be automatically logged out after specific number of minutes
          of no activity.
        </p>

        <div className="row">
          <div className="col-6">
            <p className="text-muted">Set Auto Logout period minutes</p>
            <TextField
              id="idleLogoutTime"
              name="idleLogoutTime"
              value={idleLogoutTime}
              label="Minutes"
              onChange={handleChange}
              size="small"
              error={!Number.isInteger(idleLogoutTime)}
              variant="outlined"
            />
          </div>
        </div>
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
      <AppSnackbar
        open={alert.show}
        severity={alert.severity}
        message={capitalizeFirstLetter(alert.message)}
        closeCallback={closeAlert}
      />
    </Paper>
  );
}

export default AutoLogoutSetting;
