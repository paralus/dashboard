import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem
} from "@material-ui/core";
import { useSnack } from "../../../utils";

const DataProtection = ({ edge, refreshEdge, actions, projectId }) => {
  if (!edge) return null;
  const { showSnack } = useSnack();
  const [open, setOpen] = useState(false);
  const [agentList, setAgentList] = useState([]);
  const [agentName, setAgentName] = useState("");
  const [agentErr, setAgentErr] = useState(false);
  useEffect(_ => {
    actions.getDataBackupAgents(projectId).then(res => {
      setAgentList(
        res?.data?.items?.map(a => {
          return { label: a.metadata.name, value: a.metadata.name };
        })
      );
    });
  }, []);
  const handleSaveClick = _ => {
    if (!agentName?.length) {
      setAgentErr(true);
      return;
    }
    actions
      .deployDataBackupAgent(projectId, agentName, { clusters: [edge.name] })
      .then(_ => {
        setOpen(false);
        refreshEdge();
      })
      .catch(err => {
        showSnack(
          err.response.data?.error || JSON.stringify(err.response.data)
        );
      });
  };

  // if (agentList) return null;

  return (
    <div>
      {edge.data_protection?.status && (
        <>
          <span className="mr-2">
            {edge.data_protection?.status === "PodRunning" ? (
              <span className="text-teal">RUNNING</span>
            ) : (
              <span>{edge.data_protection?.status?.toUpperCase()}</span>
            )}
          </span>
          {edge.data_protection?.agentName && (
            <span>[ Agent Name : {edge.data_protection.agentName} ]</span>
          )}
        </>
      )}
      {!edge.data_protection?.status && (
        <div className="d-flex flex-row align-items-center">
          <span className="mr-2">Not Running</span>
          <Button
            variant="contained"
            dense="true"
            size="small"
            color="primary"
            onClick={_ => setOpen(true)}
          >
            <span>Enable Backup/Restore</span>
          </Button>
        </div>
      )}
      <Dialog open={open} onClose={_ => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Enable Backup/Restore - {edge.name}</DialogTitle>

        <DialogContent>
          <p className="font-italic text-muted">
            Select agent to deploy to the cluster
          </p>
          {agentList ? (
            <TextField
              select
              margin="dense"
              id="data-backup-agent"
              name="Data Backup Agent"
              required
              value={agentName}
              label="Data Backup Agent"
              onChange={e => {
                setAgentName(e.target.value);
                setAgentErr(false);
              }}
              fullWidth
              error={agentErr}
              helperText={agentErr && "Required"}
            >
              {agentList?.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <div>No Agents Available</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={_ => setOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSaveClick}>
            Enable
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataProtection;
