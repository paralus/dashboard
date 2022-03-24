import { Box, makeStyles, Paper } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { ClusterViewContext } from "../ClusterViewContexts";
import ClusterHeader from "./ClusterHeader";
import ClusterMeta from "./ClusterMeta";
import { transformLabelsObject } from "../../../utils";
import ClusterLabelEditor from "./ClusterLabelEditor";
import HideTheChildren from "../../../components/HideTheChildren";

const useStyles = makeStyles(() => ({
  details: {
    borderRadius: 8,
    marginBottom: "320px",
  },
  tabs: {
    borderRadius: "8px 8px 0 0",
  },
  tab: {
    textTransform: "none",
    fontWeight: 500,
    minWidth: 100,
    maxWidth: 250,
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
}));

export default function ClusterDetails({ match, history, location, userRole }) {
  const {
    edge,
    setTrackerMatch,
    refreshEdge,
    pauseEdgeAutoRefresh,
    resumeEdgeAutoRefresh,
    c,
    a,
    project,
  } = useContext(ClusterViewContext);
  if (!edge) return null;
  const [openLabelEditor, setOpenLabelEditor] = useState(false);
  const labelObject = edge?.metadata?.labels || {};
  const edgeLabels = transformLabelsObject(labelObject);
  const makePath = (route) => `${match.url}/${route}`;

  const classes = useStyles();

  useEffect(() => {
    setTrackerMatch(match);
    if (
      location.pathname === match.url &&
      edge.spec.clusterData.cluster_blueprint !== "minimal"
    ) {
      history.replace(makePath("config"));
    }
  }, [location.pathname]);

  return (
    <React.Fragment>
      <ClusterHeader
        edge={edge}
        userRole={userRole}
        pauseRefresh={pauseEdgeAutoRefresh}
        resumeRefresh={resumeEdgeAutoRefresh}
        history={history}
      />
      <Paper className={classes.details}>
        <Box p={2}>
          <Switch>
            <Route
              path={makePath("config")}
              render={(rProps) => (
                <ClusterMeta
                  {...rProps}
                  edge={edge}
                  refreshEdge={refreshEdge}
                />
              )}
            />
          </Switch>
        </Box>
      </Paper>
      <HideTheChildren>
        <ClusterLabelEditor
          isOpen={openLabelEditor}
          onOpen={setOpenLabelEditor}
          labels={edgeLabels}
          edgeId={edge.id}
          refreshEdge={refreshEdge}
        />
      </HideTheChildren>
    </React.Fragment>
  );
}
