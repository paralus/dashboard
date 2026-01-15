/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

import Spinner from "components/Spinner/Spinner";
import useThunk from "../../utils/useThunk";
import {
  ClusterActionsContext,
  ClusterViewContext,
} from "./ClusterViewContexts";
import BackTracker from "./components/BackTracker";
import ClusterDetails from "./components/ClusterDetails";

const EDGES_LINK = "/app/edges";

const PROVISIONING_NOT_SUPPORTED =
  "Provising flows are not yet supported by Ops Console.";

const useStyles = makeStyles((theme) => ({
  spinnerInner: {
    backgroundColor: "transparent",
  },
}));

const isImportedAndInProgress = (edge) => {
  if (!edge) return false;
  return (
    (edge.spec.clusterType === "imported" || edge.clusterType === "v2") &&
    !isClusterReady(edge)
  );
};

const isClusterReady = (edge) => {
  if (!edge) return false;
  let ready = false;
  for (
    let index = 0;
    index < edge.spec.clusterData.cluster_status.conditions.length;
    index++
  ) {
    ready =
      edge.spec.clusterData.cluster_status.conditions[index].type ===
        "ClusterReady" &&
      edge.spec.clusterData.cluster_status.conditions[index].status ===
        "Success";
    if (ready) {
      return true;
    }
  }
  return ready;
};

const isAnOlderComponent = (location) => {
  return ["create", "edit"].some((text) => {
    return new RegExp(text, "ig").test(location);
  });
};

const isConfigState = (edge) => {
  if (!edge) return false;
  if (!edge.spec) return false;
  return edge.spec.params?.state === "CONFIG";
};

function mapStateToProps(state) {
  let userRole = state?.settings?.userRole;
  userRole = userRole?.isSuperAdmin
    ? "SUPER_ADMIN"
    : userRole?.isPartnerAdmin
      ? "PARTNER_ADMIN"
      : null;
  return {
    userRole,
    project: state?.Projects?.currentProject,
    UserSession: state?.UserSession,
    sshEdges: state?.settings?.edges,
    partnerDetail: state?.settings?.partnerDetail,
    alertsConfig: state?.Alerts?.alertsConfig,
  };
}

export default connect(mapStateToProps)(function ClusterView({
  fromOps,
  match,
  history,
  location,
  project,
  dispatch,
  userRole,
  UserSession,
  alertsConfig,
  sshEdges,
  partnerDetail,
  components: c = {},
  actions: a = {},
  images: i = {},
}) {
  const classes = useStyles();
  const [trackerMatch, setTrackerMatch] = useState(match);
  const {
    loading,
    data: edge,
    refresh: refreshEdge,
    pauseAutoRefresh: pauseEdgeAutoRefresh,
    resumeAutoRefresh: resumeEdgeAutoRefresh,
  } = useThunk({
    dispatch,
    refreshInterval: 20,
    thunk: a.getEdgeDetail,
    args: [match.params.cluster],
  });
  const makePath = (path) => [match.url, path].filter(Boolean).join("/");
  useEffect(() => {
    if (isConfigState(edge)) {
      history.push(makePath("configform"));
      return;
    }
    if (isImportedAndInProgress(edge)) {
      history.push(`/app/clusters/provision/${match.params.cluster}/imported`);
    }
  }, [edge]);
  return (
    <React.Fragment>
      {/* HACK(Muhammad Kasim): This check shouldn't be needed after refactoring
      components that are rendered at these routes. */}
      {!isAnOlderComponent(location.pathname) && (
        <BackTracker match={trackerMatch} edge={edge} />
      )}
      <ClusterViewContext.Provider
        value={{
          fromOps,
          a,
          c,
          edge,
          i,
          project,
          refreshEdge,
          pauseEdgeAutoRefresh,
          resumeEdgeAutoRefresh,
          setTrackerMatch,
        }}
      >
        <Spinner hideChildren loading={loading} classes={classes}>
          <Switch>
            <ClusterActionsContext.Provider
              value={{
                UserSession,
                project,
                sshEdges,
                partnerDetail,
                alertsConfig,
              }}
            >
              <Route
                path={makePath("")}
                render={(rProps) => (
                  <ClusterDetails {...rProps} userRole={userRole} />
                )}
              />
            </ClusterActionsContext.Provider>
          </Switch>
        </Spinner>
      </ClusterViewContext.Provider>
    </React.Fragment>
  );
});
