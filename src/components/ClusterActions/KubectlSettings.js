import React, { useState, useEffect } from "react";
import { Button, Switch, CircularProgress } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  getClusterKubectlSettings,
  setClusterKubectlSettings,
} from "actions/index";

const KubectlSettings = ({ open, onClose, edge }) => {
  if (!edge) return null;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsError, setSettingsError] = useState(false);
  const [settings, setSettings] = useState({
    disableCLIKubectl: false,
    disableWebKubectl: false,
  });
  const KubectlConfig = useSelector((s) => s.Kubectl?.kubectlConfig);
  const clusterID = edge.metadata?.id;

  useEffect(
    (_) => {
      setSettingsError(!clusterID);
    },
    [clusterID],
  );

  useEffect(() => {
    if (open && loading && clusterID && isClusterReady) {
      getClusterKubectlSettings(clusterID)
        .then((res) => {
          setSettings(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setSettingsError(true);
        });
    }
  }, [open]);
  const handleSave = (_) => {
    setSaving(true);
    setClusterKubectlSettings(clusterID, settings).then((_) => {
      setSaving(false);
      onClose();
    });
  };

  const isClusterReady = () => {
    let ready = false;
    if (
      edge?.spec.clusterData &&
      edge?.spec.clusterData.cluster_status &&
      edge?.spec.clusterData.cluster_status.conditions &&
      edge?.spec.clusterData.cluster_status.conditions.length > 0
    ) {
      for (
        let index = 0;
        index < edge?.spec.clusterData?.cluster_status?.conditions?.length;
        index++
      ) {
        ready =
          edge.spec.clusterData.cluster_status.conditions[index].type ===
            "ClusterReady" &&
          edge.spec.clusterData.cluster_status.conditions[index].status === 3;
        if (ready) {
          return ready;
        }
      }
    }
    return ready;
  };

  return saving ? (
    <CircularProgress size={50} className="cluster-action-loading" />
  ) : (
    <>
      {(settingsError || !isClusterReady) && (
        <div className="p-3">Failed to load Kubectl Settings</div>
      )}
      {open && !loading && (
        <div>
          <p className="text-muted font-italic mt-3 mb-4">
            Edit access to Kubectl CLI (Terminal) and Browser-based Kubectl
          </p>
          <div className="row">
            <div className="col-md-4 py-2">Kubectl CLI Access (Terminal)</div>
            <div className="col-md-6">
              {KubectlConfig?.disableCLIKubectl ? (
                <div className="mt-2 font-italic text-muted">
                  Disabled for the Organization
                </div>
              ) : (
                <>
                  <Switch
                    id="gpu_enabled"
                    color="primary"
                    checked={!settings.disableCLIKubectl}
                    disabled={KubectlConfig?.disableCLIKubectl}
                    onChange={(_) => {
                      setSettings({
                        ...settings,
                        disableCLIKubectl: !settings.disableCLIKubectl,
                      });
                    }}
                  />
                  <span className="ml-3">
                    {settings.disableCLIKubectl ? "Disabled" : "Enabled"}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-4 py-2">Browser Kubectl Access</div>
            <div className="col-md-6">
              {KubectlConfig?.disableWebKubectl ? (
                <div className="mt-2 font-italic text-muted">
                  Disabled for the Organization
                </div>
              ) : (
                <>
                  <Switch
                    id="gpu_enabled"
                    color="primary"
                    checked={!settings.disableWebKubectl}
                    disabled={KubectlConfig?.disableWebKubectl}
                    onChange={(_) => {
                      setSettings({
                        ...settings,
                        disableWebKubectl: !settings.disableWebKubectl,
                      });
                    }}
                  />
                  {settings.disableWebKubectl ? (
                    <span className="ml-3">Disabled</span>
                  ) : (
                    <span className="ml-3">Enabled</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="row float-right mt-4">
        <Button onClick={onClose}>CANCEL</Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={settingsError || !isClusterReady}
        >
          SAVE
        </Button>
      </div>
    </>
  );
};

export default KubectlSettings;
