import { Box, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Spinner from "components/Spinner/Spinner";
import { ClusterViewContext } from "../ClusterViewContexts";
import ClusterHeader from "./ClusterHeader";
import ClusterMeta from "./ClusterMeta";
import OverviewTab from "./OverviewTab";
import { transformLabelsObject } from "../../../utils";
import ClusterLabelEditor from "./ClusterLabelEditor";
import ResourcesTab from "./ResourcesTab";
import { TimeControlProvider } from "./TimeControl";
import ResourceFilterProvider from "./ResourceFilters";
import NodeGroupTab from "./NodeGroupTab";
import NodePoolTab from "./NodePoolTab";
import HideTheChildren from "../../../components/HideTheChildren";
import Banner from "../../../components/Banner";

const NODES_NOT_SUPPORTED =
  "Nodes listing is not yet supported by Ops Console.";
const ACTIVITY_NOT_SUPPORTED =
  "Kubernetes activity details are not yet supported by Ops Console.";

const useStyles = makeStyles(() => ({
  details: {
    borderRadius: 8,
    marginBottom: "320px"
  },
  tabs: {
    borderRadius: "8px 8px 0 0"
  },
  tab: {
    textTransform: "none",
    fontWeight: 500,
    minWidth: 100,
    maxWidth: 250
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
}));

const getTabs = (isEks, monitoringDisabled, cluster_type) => {
  if (cluster_type === "azure-aks") {
    return [
      { key: "overview", label: "Overview", disabled: monitoringDisabled },
      { key: "nodes", label: "Nodes" },
      { key: "nodepools", label: "Node Pools" },
      { key: "resources", label: "Resources", disabled: monitoringDisabled },
      { key: "config", label: "Configuration" },
      { key: "activity", label: "Upgrade Jobs" }
    ];
  }
  if (isEks) {
    return [
      { key: "overview", label: "Overview", disabled: monitoringDisabled },
      { key: "nodes", label: "Nodes" },
      { key: "nodegroup", label: "Node Group" },
      { key: "resources", label: "Resources", disabled: monitoringDisabled },
      { key: "config", label: "Configuration" },
      { key: "activity", label: "Upgrade Jobs" },
      { key: "serviceAccounts", label: "IAM Service Accounts" }
    ];
  }
  if (cluster_type === "imported") {
    return [
      { key: "overview", label: "Overview", disabled: monitoringDisabled },
      { key: "nodes", label: "Nodes" },
      { key: "resources", label: "Resources", disabled: monitoringDisabled },
      { key: "config", label: "Configuration" }
    ];
  }
  return [
    { key: "overview", label: "Overview", disabled: monitoringDisabled },
    { key: "nodes", label: "Nodes" },
    { key: "resources", label: "Resources", disabled: monitoringDisabled },
    { key: "config", label: "Configuration" },
    { key: "activity", label: "Upgrade Jobs" }
  ];
};

export default function ClusterDetails({ match, history, location, userRole }) {
  const {
    edge,
    setTrackerMatch,
    refreshEdge,
    pauseEdgeAutoRefresh,
    resumeEdgeAutoRefresh, c, a, project } = useContext(
    ClusterViewContext
  );
  if (!edge) return null;
  const [nav, setNav] = useState(getTabs());
  const [loading, setLoading] = useState(true);
  const [monitoring, setMonitoring] = useState(true);
  const [openLabelEditor, setOpenLabelEditor] = useState(false);
  const labelObject = edge?.cluster?.metadata?.labels || {};
  const edgeLabels = transformLabelsObject(labelObject);
  const makePath = route => `${match.url}/${route}`;
  const isEksEdge = edge.cluster_type === "aws-eks";
  const isAksEdge = edge.cluster_type === "azure-aks";
  const cluster_type = edge.cluster_type;
  const [tabIdx, setTabIdx] = useState(0);

  useEffect(() => {
    refreshEdge();
    const monitoringDisabled = edge.cluster_blueprint === "minimal";
    setNav(getTabs(isEksEdge, monitoringDisabled, cluster_type));
    if (monitoringDisabled) {
      setLoading(false);
      setMonitoring(false);
      if (location.pathname === match.url) history.push(makePath("config"));
      if (location.pathname.includes(`${match.url}/resources`)) {
        history.push(makePath("config"));
      }
    }
    if (edge.cluster_blueprint === "default") {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      edge &&
      loading &&
      !["default", "minimal"].includes(edge.cluster_blueprint)
    ) {
      a.getBlueprintPublishStatus(edge.name, project.id)
        .then(res => {
          const workloads = res?.data?.workloads;
          if (
            !workloads?.find(t =>
              ["v2-alertmanager", "rafay-prometheus"].includes(t.workloadName)
            )
          ) {
            setNav(getTabs(isEksEdge, true, cluster_type));
            setMonitoring(false);
            if (location.pathname === match.url)
              history.push(makePath("config"));
            if (location.pathname.includes(`${match.url}/resources`)) {
              history.push(makePath("config"));
            }
          }
        })
        .finally(_ => setLoading(false));
    }
  }, []);

  const classes = useStyles();

  const handleTabChange = (e, index) => {
    setTabIdx(index);
    switch (index) {
      case 0:
        history.push(makePath("overview"));
        break;
      case 1:
        history.push(makePath("nodes"));
        break;
      case 2:
        if (isAksEdge) {
          history.push(makePath("nodepools"));
        } else {
          history.push(
            makePath(isEksEdge ? "nodegroup" : "resources/namespaces")
          );
        }
        break;
      case 3:
        history.push(
          makePath(isEksEdge || isAksEdge ? "resources/namespaces" : "config")
        );
        break;
      case 4:
        history.push(makePath(isEksEdge || isAksEdge ? "config" : "activity"));
        break;
      case 5:
        history.push(makePath("activity"));
        break;
      case 6:
        history.push(makePath("serviceAccounts"));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setTrackerMatch(match);
    if (
      location.pathname === match.url &&
      edge.cluster_blueprint !== "minimal"
    ) {
      history.replace(makePath("overview"));
    }
    if (location.pathname.includes(`${match.url}/overview`)) {
      setTabIdx(0);
    }
    if (location.pathname.includes(`${match.url}/nodes`)) {
      setTabIdx(1);
    }
    if (location.pathname.includes(`${match.url}/nodegroup`)) {
      setTabIdx(2);
    }
    if (location.pathname.includes(`${match.url}/nodepools`)) {
      setTabIdx(2);
    }
    if (location.pathname.includes(`${match.url}/config`)) {
      setTabIdx(isEksEdge || isAksEdge ? 4 : 3);
    }
    if (location.pathname.includes(`${match.url}/resources`)) {
      setTabIdx(isEksEdge || isAksEdge ? 3 : 2);
    }
    if (location.pathname.includes(`${match.url}/activity`)) {
      setTabIdx(isEksEdge || isAksEdge ? 5 : 4);
    }
    if (location.pathname.includes(`${match.url}/serviceAccounts`)) {
      setTabIdx(6);
    }
  }, [location.pathname]);

  return (
    <React.Fragment>
      <ClusterHeader edge={edge} userRole={userRole} pauseRefresh={pauseEdgeAutoRefresh} resumeRefresh={resumeEdgeAutoRefresh} history={history} />
      <Spinner hideChildren loading={loading}>
        <Paper className={classes.details}>
          <Paper elevation={0} className={classes.tabs}>
            <Tabs
              value={tabIdx}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              {nav.map(({ key, label, disabled }) => (
                <Tab
                  disableRipple
                  key={key}
                  label={label}
                  disabled={disabled}
                  classes={{
                    root: classes.tab,
                    wrapper: classes.tabWrapper
                  }}
                />
              ))}
            </Tabs>
          </Paper>
          <Box p={2}>
            <Switch>
              <Route
                path={makePath("overview")}
                render={rProps => {
                  return (
                    <TimeControlProvider>
                      <OverviewTab {...rProps} match={match} />
                    </TimeControlProvider>
                  );
                }}
              />
              <Route
                path={makePath("nodes")}
                render={rProps => {
                  return (
                    <HideTheChildren
                      hide={!c.OnPremNodesList || !c.AutoNodesList}
                      component={
                        <Banner
                          severity="info"
                          closeable={false}
                          message={NODES_NOT_SUPPORTED}
                        />
                      }
                    >
                      {["manual"].includes(edge && edge.cluster_type)
                        ? React.createElement(c.OnPremNodesList, {
                            ...rProps,
                            data: R.sort(
                              R.ascend(R.prop("node_id")),
                              edge.nodes
                            ),
                            monitoring,
                            edge,
                            match
                          })
                        : React.createElement(c.AutoNodesList, {
                            ...rProps,
                            data: R.sort(
                              R.ascend(R.prop("node_id")),
                              edge.nodes
                            ),
                            monitoring,
                            edge,
                            match
                          })}
                    </HideTheChildren>
                  );
                }}
              />
              <Route
                path={makePath("nodegroup")}
                render={rProps => <NodeGroupTab {...rProps} edge={edge} />}
              />
              <Route
                path={makePath("resources/:type/:ctype?")}
                render={rProps => (
                  <ResourceFilterProvider edge={edge}>
                    <ResourcesTab {...rProps} clusterDetailsMatch={match} />
                  </ResourceFilterProvider>
                )}
              />
              <Route
                path={makePath("config")}
                render={rProps => (
                  <ClusterMeta
                    {...rProps}
                    edge={edge}
                    refreshEdge={refreshEdge}
                  />
                )}
              />
              <Route
                path={makePath("activity")}
                render={rProps => {
                  return (
                    <HideTheChildren
                      hide={!c.KubernetesDetails}
                      component={
                        <Banner
                          severity="info"
                          closeable={false}
                          message={ACTIVITY_NOT_SUPPORTED}
                        />
                      }
                    >
                      {React.createElement(c.KubernetesDetails, {
                        ...rProps,
                        edge
                      })}
                    </HideTheChildren>
                  );
                }}
              />
              <Route
                path={makePath("serviceaccounts")}
                render={rProps => {
                  return (
                    <HideTheChildren
                      hide={!c.ServiceAccounts}
                      component={
                        <Banner
                          severity="info"
                          closeable={false}
                          message={ACTIVITY_NOT_SUPPORTED}
                        />
                      }
                    >
                      {React.createElement(c.ServiceAccounts, {
                        ...rProps,
                        edge
                      })}
                    </HideTheChildren>
                  );
                }}
              />
              <Route
                path={makePath("nodepools")}
                render={rProps => <NodePoolTab {...rProps} edge={edge} />}
              />
            </Switch>
          </Box>
        </Paper>
      </Spinner>
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
