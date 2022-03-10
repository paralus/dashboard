import React from "react";
import clsx from "clsx";
import moment from "moment";
import * as R from "ramda";
import { Badge } from "reactstrap";
import {
  Paper,
  Box,
  Typography,
  Tooltip,
  makeStyles,
  fade,
  Grid
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ClusterActions from "components/ClusterActions/index";
import KubeCtlShellAccess from "../../../components/KubeCtlShellAccess";
import BlueprintSyncStatus from "./BlueprintSyncStatus";

const Statuses = {
  NODE_PROVISION_COMPLETE: {
    label: "Node Provision Complete",
    color: "#2454ff"
  }
};
const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    display: "flex",
    "& > div": {
      flex: 1
    }
  },
  health: {
    marginLeft: theme.spacing(4),
    display: "inline-flex",
    alignItems: "center"
  },
  healthIcon: {
    marginRight: 6
  },
  healthy: {
    fill: theme.palette.success.light,
    filter: `drop-shadow(0px 0px 6px ${fade(
      theme.palette.success.light,
      0.75
    )})`
  },
  unhealthy: {
    fill: theme.palette.error.light,
    filter: `drop-shadow(0px 0px 6px ${fade(theme.palette.error.light, 0.75)})`
  }
}));

function getStatus({ status }) {
  const getStatusColor = R.cond([
    [R.equals("READY"), R.always("primary")],
    [R.test(/(NOT|FAIL)/), R.always("error")],
    [R.T, R.always("textSecondary")]
  ]);
  return (
    <Typography display="inline" color={getStatusColor(status)}>
      {status || "NOT_READY"}
    </Typography>
  );
}

function getHealth({ health, reason, health_status_modified_at }, classes) {
  const isHealthy = health === 1;
  const lastUpdated = health_status_modified_at
    ? moment(health_status_modified_at).fromNow()
    : "N/A";

  return (
    <React.Fragment>
      <FiberManualRecordIcon
        fontSize="inherit"
        className={clsx(
          classes.healthIcon,
          classes[isHealthy ? "healthy" : "unhealthy"]
        )}
      />
      <Tooltip
        placement="top"
        title={reason ? <Typography variant="body2">{reason}</Typography> : ""}
      >
        <span>{isHealthy ? "Healthy" : "Unhealthy"}</span>
      </Tooltip>
      <Typography
        variant="caption"
        color="textSecondary"
        style={{ marginLeft: 12 }}
      >
        Last Check in {lastUpdated}
      </Typography>
    </React.Fragment>
  );
}

export default function ClusterHeader({
  edge,
  userRole,
  pauseRefresh,
  resumeRefresh
}) {
  if (!edge) return null;
  const classes = useStyles();
  const getStatusColorCode = data => {
    if (!data) {
      return null;
    }
    const status = data.toLowerCase();
    let color = "gray";
    if (status.includes("progress")) {
      color = "blue";
    } else if (
      status.toUpperCase().includes("UPGRADE SUCCESSFUL VALIDATION FAILED")
    ) {
      color = "orange";
    } else if (status.includes("fail")) {
      color = "red";
    } else if (status.includes("success")) {
      color = "#009688";
    }
    return color;
  };

  const parseUpgradeState = (value =>
    edge?.cluster_type === "azure-aks"
      ? value?.replace("NODEGROUP", "NODEPOOL")
      : value)(
    edge?.edge_upgrade_info?.upgrade_state_status_str?.toUpperCase()
  );

  return (
    <Paper className={classes.root}>
      <Box p={2}>
        <Typography color="primary" paragraph variant="h5">
          {edge.name} &nbsp; &nbsp;
          {edge.provision &&
            edge.provision.status &&
            edge.provision.status.includes(
              "UPDATE_CLUSTER_ENDPOINTS_INPROGRESS"
            ) && (
              <Badge className="cluster-glow-status sm" color="info">
                UPDATING CLUSTER ENDPOINTS
              </Badge>
            )}
        </Typography>
        <Box display="flex" alignItems="center" height="20px" lineHeight="20px">
          <Typography display="inline" component="span">
            Status: {getStatus(edge)}
          </Typography>

          <Typography
            display="inline"
            className={classes.health}
            component="span"
          >
            {getHealth(edge, classes)}
          </Typography>
          {edge &&
            edge.edge_upgrade_info &&
            edge.edge_upgrade_info.upgrade_state_status_str && (
              <Typography
                display="inline"
                component="span"
                style={{
                  marginLeft: "500px",
                  position: "absolute"
                }}
              >
                Last Upgrade Status :
                <span
                  className="ml-1"
                  style={{
                    color: getStatusColorCode(
                      edge.edge_upgrade_info.upgrade_state_status_str
                    )
                  }}
                >
                  {parseUpgradeState}
                </span>
              </Typography>
            )}
        </Box>
        <BlueprintSyncStatus edge={edge} isHeader />
      </Box>
      <Box p={2}>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <ClusterActions
            edge={edge}
            isDetails
            userRole={userRole}
            resumeAutoRefresh={resumeRefresh}
            pauseAutoRefresh={pauseRefresh}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <KubeCtlShellAccess
            projectId={edge.project_id}
            clusterName={edge.name}
          />
        </Grid>
      </Box>
    </Paper>
  );
}
