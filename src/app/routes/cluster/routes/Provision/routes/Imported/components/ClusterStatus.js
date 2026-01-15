import React from "react";
import { Badge } from "reactstrap";
import { Paper, makeStyles } from "@material-ui/core";
import StatusStepper from "./StatusStepper";

const useStyles = makeStyles((theme) => ({
  reasons: {
    border: "1px solid black",
    background: "whitesmoke",
    borderRadius: "3px",
    padding: "15px",
  },
  status: { marginTop: "-2px" },
}));

const ClusterStatus = ({ clusterStatus }) => {
  if (!clusterStatus) return null;
  const classes = useStyles();
  let statusBadge = "pending";
  if (
    clusterStatus.ClusterReady === "Pending" &&
    clusterStatus.ClusterRegister === "Pending"
  ) {
    statusBadge = "pending";
  }
  if (
    clusterStatus.ClusterReady === "Pending" &&
    clusterStatus.ClusterRegister === "Success"
  ) {
    statusBadge = "provisioning";
  }
  if (clusterStatus.ClusterReady === "Success") {
    statusBadge = "provisioned";
  }
  if (
    [clusterStatus.ClusterRegister, clusterStatus.ClusterCheckIn].includes(
      "Failed",
    )
  ) {
    statusBadge = "failed";
  }
  return (
    <Paper className="p-3 mb-2">
      <h2 className="d-flex">
        <div>Cluster Status &nbsp;</div>
        <div className={classes.status}>
          {statusBadge === "pending" && (
            <Badge color="light">REGISTRATION PENDING</Badge>
          )}
          {statusBadge === "provisioning" && (
            <Badge className="cluster-glow-status" color="info">
              PROVISIONING
            </Badge>
          )}
          {statusBadge === "provisioned" && (
            <Badge color="success">PROVISIONED</Badge>
          )}
          {statusBadge === "failed" && <Badge color="danger">FAILED</Badge>}
        </div>
      </h2>
      <div>
        <StatusStepper statusObj={clusterStatus} />
      </div>
      {!!Object.keys(clusterStatus.reasons).length && (
        <div className={classes.reasons}>
          {clusterStatus.ClusterRegister === "Failed" && (
            <div className="mb-2">
              <div className="font-weight-bold">Registration Failure:</div>
              <div className="text-danger">
                {clusterStatus.reasons.ClusterRegister}
              </div>
            </div>
          )}
          {clusterStatus.ClusterCheckIn === "Failed" && (
            <div className="mb-2">
              <div className="font-weight-bold">CheckIn Failure:</div>
              <div className="text-danger">
                {clusterStatus.reasons.ClusterCheckIn}
              </div>
            </div>
          )}
        </div>
      )}
    </Paper>
  );
};

export default ClusterStatus;
