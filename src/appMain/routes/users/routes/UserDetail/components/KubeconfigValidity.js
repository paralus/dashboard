import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import AppSnackbar from "components/AppSnackbar";
import { useDispatch } from "react-redux";
import { getOrgKubeconfigSettings } from "actions/index";
import { capitalizeFirstLetter } from "../../../../../../utils";

const KubeconfigValidity = ({ settings, onSave, orgSetting, orgId }) => {
  if (!settings) return null;
  const dispatch = useDispatch();
  const min_minutes = 10;
  const max_minutes = 30 * 24 * 60;

  const saInputProps = {
    min_minutes,
    max_minutes,
  };
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  const closeAlert = (_) => {
    setAlert({
      ...alert,
      show: false,
      message: "",
    });
  };

  const getMinutes = (seconds) => {
    if (!seconds) return "";
    return Math.round(seconds / 60);
  };

  const getHours = (seconds) => {
    if (!seconds) return "";
    return Math.round(seconds / (60 * 60));
  };

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [kubectlSettings, setKubectlSettings] = useState(settings);

  const onHoursChange = (e) => {
    const val = Number.parseInt(e.target.value, 10);
    // if (Number.isNaN(val)) {
    //   setHours("");
    //   return;
    // }
    // setHours(val);
    setKubectlSettings({
      ...kubectlSettings,
      validitySeconds: val * (60 * 60),
    });
    setIsSaveDisabled(false);
  };

  const onMinutesChange = (e, key) => {
    var val = Number.parseInt(e.target.value, 10);
    if (val > max_minutes) val = max_minutes;
    if (val < min_minutes) val = min_minutes;
    setKubectlSettings({
      ...kubectlSettings,
      [key]: val * 60,
    });
    setIsSaveDisabled(false);
  };

  const onCheckboxChange = (e) => {
    const { name, checked } = e.target;
    // if (checked === session) {
    //   setSessionCheck(checked);
    //   setIsSaveDisabled(true);
    //   return;
    // }
    setKubectlSettings({
      ...kubectlSettings,
      [name]: checked,
    });
    setIsSaveDisabled(false);
  };

  const onComponentSave = (_) => {
    onSave(kubectlSettings)
      .then((_) => {
        setAlert({
          show: true,
          message: "Kubeconfig Settings Updated",
          severity: "success",
        });
        if (orgSetting) dispatch(getOrgKubeconfigSettings(orgId));
        setIsSaveDisabled(true);
      })
      .catch((error) => {
        setAlert({
          show: true,
          message: error?.response?.data?.message || "Unexpected Error",
          severity: "error",
        });
      });
  };

  return (
    <Paper className="col-md-6 p-0">
      <div className="p-3">
        <h3>KubeCTL Settings</h3>
        <div className="col d-flex flex-column pl-0">
          <div>
            <p className="text-muted">Set Kubeconfig's validity period</p>
            <TextField
              margin="dense"
              id="seconds"
              name="seconds"
              value={getHours(kubectlSettings?.validitySeconds)}
              label="Hours"
              onChange={onHoursChange}
              size="small"
              type="number"
              // error={!Number.isInteger(hours)}
              variant="outlined"
            />
          </div>
          <br />
          <div>
            <p className="text-muted">
              De-provision service account if inactive for more than
            </p>
            <TextField
              margin="dense"
              id="sa-seconds"
              name="sa-seconds"
              value={getMinutes(kubectlSettings?.saValiditySeconds)}
              label="Minutes"
              onChange={(e) => onMinutesChange(e, "saValiditySeconds")}
              size="small"
              type="number"
              // error={!Number.isInteger(hours)}
              variant="outlined"
              inputProps={saInputProps}
            />
          </div>
          <div className="mt-3">
            <FormControlLabel
              control={
                <Checkbox
                  name="enableSessionCheck"
                  checked={kubectlSettings.enableSessionCheck}
                  onChange={onCheckboxChange}
                  color="primary"
                />
              }
              label="Require console login before kubectl access"
            />
          </div>
          {orgSetting && (
            <>
              <div className="mt-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="disableCLIKubectl"
                      checked={kubectlSettings.disableCLIKubectl}
                      onChange={onCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Disable Kubectl CLI Access (Terminal)"
                />
              </div>
              <div className="mt-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="disableWebKubectl"
                      checked={kubectlSettings.disableWebKubectl}
                      onChange={onCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Disable Browser Kubectl Access"
                />
              </div>
              <div className="mt-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="enforceOrgAdminSecretAccess"
                      checked={kubectlSettings.enforceOrgAdminSecretAccess}
                      onChange={onCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Allow only Organization Admin to access secret via Kubectl"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className="p-3 mt-2 d-flex flex-row-reverse"
        style={{ borderTop: "1px solid lightgray" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onComponentSave}
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
};

export default KubeconfigValidity;
