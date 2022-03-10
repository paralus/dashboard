/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

import Spinner from "components/Spinner/Spinner";
import useThunk from "../../utils/useThunk";
import {
  ClusterActionsContext,
  ClusterViewContext
} from "./ClusterViewContexts";
import BackTracker from "./components/BackTracker";
import ClusterDetails from "./components/ClusterDetails";
import NodeDetails from "./components/NodeDetails";
import PodDetails from "./components/PodDetails";
import EmptyScreen from "../../components/EmptyScreen";
import HideTheChildren from "../../components/HideTheChildren";
import ContainerDetails from "./components/ContainerDetails";

const EDGES_LINK = "/app/edges";

const PROVISIONING_NOT_SUPPORTED =
  "Provising flows are not yet supported by Ops Console.";

const useStyles = makeStyles(theme => ({
  spinnerInner: {
    backgroundColor: "transparent"
  }
}));

const isAutoAndInProgress = edge => {
  if (!edge) return false;
  return (
    !["manual", "imported"].includes(edge.cluster_type) &&
    [
      "NOT_READY",
      "PROVISIONING",
      "PROVISION_FAILED",
      "PRETEST_FAILED"
    ].includes(edge.status)
  );
};

const isManualAndInProgress = edge => {
  if (!edge) return false;
  return (
    ["manual"].includes(edge.cluster_type) &&
    !["READY", "MAINTENANCE", "UPGRADING"].includes(edge.status)
  );
};

const isImportedAndInProgress = edge => {
  if (!edge) return false;
  return (
    (edge.cluster_type === "imported" || edge.cluster_type === "v2") &&
    edge.status === "NOT_READY"
  );
};

const isAnOlderComponent = location => {
  return ["create", "edit"].some(text => {
    return new RegExp(text, "ig").test(location);
  });
};

const isConfigState = edge => {
  if (!edge) return false;
  if (!edge.provision_params) return false;
  return edge.provision_params.state === "CONFIG";
};

function mapStateToProps(state) {
  let userRole = state?.settingsOps?.userRole;
  userRole = userRole?.isSuperAdmin
    ? "SUPER_ADMIN"
    : userRole?.isPartnerAdmin
    ? "PARTNER_ADMIN"
    : null;
  return {
    userRole,
    project: state?.Projects?.currentProject,
    UserSession: state?.UserSession,
    sshEdges: state?.settingsOps?.edges,
    partnerDetail: state?.settings?.partnerDetail,
    alertsConfig: state?.Alerts?.alertsConfig
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
  images: i = {}
}) {
  const classes = useStyles();
  const [trackerMatch, setTrackerMatch] = useState(match);
  const [podContainers, setPodContainers] = useState([]);
  const {
    loading,
    data: edge,
    refresh: refreshEdge,
    pauseAutoRefresh: pauseEdgeAutoRefresh,
    resumeAutoRefresh: resumeEdgeAutoRefresh
  } = useThunk({
    dispatch,
    refreshInterval: 20,
    thunk: a.getEdgeDetailOP,
    args: [match.params.edgeId, project?.id]
  });
  const makePath = path => [match.url, path].filter(Boolean).join("/");
  useEffect(() => {
    if (isConfigState(edge)) {
      if (edge.cluster_type === "aws-eks") {
        history.push(makePath("eksconfigform"));
        return;
      }
      if (edge.cluster_type === "azure-aks") {
        history.push(makePath("aksconfigform"));
        return;
      }
      history.push(makePath("configform"));
      return;
    }
    if (isAutoAndInProgress(edge)) {
      history.push(`/app/clusters/provision/${match.params.edgeId}/auto`);
      return;
    }
    if (isManualAndInProgress(edge)) {
      history.push(makePath("manual-provision"));
    }
    if (isImportedAndInProgress(edge)) {
      history.push(`/app/clusters/provision/${match.params.edgeId}/imported`);
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
          podContainers,
          setPodContainers
        }}
      >
        <Spinner hideChildren loading={loading} classes={classes}>
          <Switch>
            <Route
              path={makePath("auto-provision")}
              render={() => {
                return (
                  <HideTheChildren
                    hide={!c.NewAutoProvisionCluster}
                    component={
                      <EmptyScreen
                        title={PROVISIONING_NOT_SUPPORTED}
                        link={EDGES_LINK}
                      />
                    }
                  >
                    {React.createElement(c.NewAutoProvisionCluster, { edge })}
                  </HideTheChildren>
                );
              }}
            />
            <Route
              path={makePath("manual-provision")}
              render={() => {
                return (
                  <HideTheChildren
                    hide={!c.NewManualProvisionCluster}
                    component={
                      <EmptyScreen
                        title={PROVISIONING_NOT_SUPPORTED}
                        link={EDGES_LINK}
                      />
                    }
                  >
                    {React.createElement(c.NewManualProvisionCluster, { edge })}
                  </HideTheChildren>
                );
              }}
            />
            <Route path={makePath("nodes/:node")} component={NodeDetails} />
            <Route
              path={makePath("pods/:pod/containers/:container")}
              component={ContainerDetails}
            />
            <Route path={makePath("pods/:pod")} component={PodDetails} />
            <ClusterActionsContext.Provider
              value={{
                UserSession,
                project,
                sshEdges,
                partnerDetail,
                alertsConfig
              }}
            >
              <Route
                path={makePath("")}
                render={rProps => (
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
