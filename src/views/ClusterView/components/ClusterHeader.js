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
  Grid,
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ClusterActions from "components/ClusterActions/index";
import KubeCtlShellAccess from "../../../components/KubeCtlShellAccess";

const Statuses = {
  NODE_PROVISION_COMPLETE: {
    label: "Node Provision Complete",
    color: "#2454ff",
  },
};
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    display: "flex",
    "& > div": {
      flex: 1,
    },
  },
  health: {
    marginLeft: theme.spacing(4),
    display: "inline-flex",
    alignItems: "center",
  },
  healthIcon: {
    marginRight: 6,
  },
  healthy: {
    fill: theme.palette.success.light,
    filter: `drop-shadow(0px 0px 6px ${fade(
      theme.palette.success.light,
      0.75
    )})`,
  },
  unhealthy: {
    fill: theme.palette.error.light,
    filter: `drop-shadow(0px 0px 6px ${fade(theme.palette.error.light, 0.75)})`,
  },
}));

const getClusterStatus = (edge) => {
  if (!edge) return false;
  let status = "NOT READY";
  for (
    let index = 0;
    index < edge.spec.clusterData.cluster_status.conditions.length;
    index++
  ) {
    let ready =
      edge.spec.clusterData.cluster_status.conditions[index].type ===
        "ClusterReady" &&
      edge.spec.clusterData.cluster_status.conditions[index].status ===
        "Success";
    if (ready) {
      return "READY";
    }
  }
  return status;
};

function getStatus({ edge }) {
  const getStatusColor = R.cond([
    [R.equals("READY"), R.always("primary")],
    [R.test(/(NOT|FAIL)/), R.always("error")],
    [R.T, R.always("textSecondary")],
  ]);
  if (!edge) return false;
  let status = getClusterStatus(edge);
  return (
    <Typography display="inline" color={getStatusColor(status)}>
      {status || "NOT_READY"}
    </Typography>
  );
}

function getHealth(edge, classes) {
  const { health, reason, health_status_modified_at } = edge;
  let isHealthy = health === 1;
  //check cluster status
  if (!isHealthy) {
    isHealthy = getClusterStatus(edge) === "READY";
  }
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
        <span>{isHealthy ? "Imported" : "Unavailable"}</span>
      </Tooltip>
    </React.Fragment>
  );
}

export default function ClusterHeader({
  edge,
  history,
  userRole,
  pauseRefresh,
  resumeRefresh,
}) {
  if (!edge) return null;
  const classes = useStyles();
  const getStatusColorCode = (data) => {
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
  return (
    <Paper className={classes.root}>
      <Box p={2}>
        <Typography color="primary" paragraph variant="h5">
          {edge.metadata.name} &nbsp; &nbsp;
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
        </Box>
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
            projectId={edge.metadata.project}
            clusterName={edge.metadata.name}
          />
        </Grid>
      </Box>
    </Paper>
  );
}
