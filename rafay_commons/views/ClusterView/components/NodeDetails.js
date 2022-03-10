import { Box, Grid, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";

import useThunk from "utils/useThunk";
import { ClusterViewContext } from "../ClusterViewContexts";
import NodeHeader from "./NodeHeader";
import NodeMeta from "./NodeMeta";
import NodeOverview from "./NodeOverview";
import GpuDashboard from "./GpuDashboard";
import { TimeControlProvider } from "./TimeControl";
import IfThen from "./IfThen";
import { useQuery } from "rafay_commons/utils";

const TABS = {
  OVERVIEW: 0,
  GPU: 1,
  CONFIG: 2
};

const useStyles = makeStyles(theme => ({
  details: {
    borderRadius: 8
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

function mapStateToProps({ Projects }) {
  return {
    project: Projects.currentProject
  };
}

export default connect(mapStateToProps)(function NodeDetails({
  match,
  project,
  dispatch
}) {
  const { a, edge, setTrackerMatch } = useContext(ClusterViewContext);
  if (!edge) return null;

  const classes = useStyles();
  const node = edge.nodes.find(n => n.id === match.params.node);
  const [selectedTab, setSelectedTab] = useState(TABS.OVERVIEW);
  const [monitoring, setMonitoring] = useState(true);
  const { query } = useQuery();
  const { loading, data: edgeHealth } = useThunk({
    dispatch,
    refreshInterval: 30,
    thunk: a.getPodStatus,
    args: [edge.edge_id, project.id]
  });

  const handleMetaToggle = (e, index) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    const tab = query.get("tab");
    if (tab === "gpu") setSelectedTab(TABS.GPU);
    setTrackerMatch(match);
  }, []);

  useEffect(() => {
    if (edge && edge.cluster_blueprint === "minimal") {
      setSelectedTab(TABS.CONFIG);
      setMonitoring(false);
    }
    if (edge && !["default", "minimal"].includes(edge.cluster_blueprint)) {
      a.getBlueprintPublishStatus(edge.name, project.id).then(res => {
        const workloads = res?.data?.workloads;
        if (
          !workloads.find(t =>
            ["v2-alertmanager", "rafay-prometheus"].includes(t.workloadName)
          )
        ) {
          setSelectedTab(TABS.CONFIG);
          setMonitoring(false);
        }
      });
    }
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NodeHeader node={node} />
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.details}>
          <Paper elevation={0} className={classes.tabs}>
            <Tabs
              value={selectedTab}
              onChange={handleMetaToggle}
              indicatorColor="primary"
              textColor="primary"
            >
              {[
                { key: "overview", label: "Overview", disabled: !monitoring },
                { key: "gpu", label: "GPU", disabled: !node.num_gpus },
                { key: "config", label: "Configuration" }
              ].map(({ key, label, disabled }) => (
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
            {/* Node Overview Tab */}
            <IfThen condition={selectedTab === TABS.OVERVIEW}>
              <TimeControlProvider>
                <NodeOverview node={node} />
              </TimeControlProvider>
            </IfThen>
            {/* Node GPU Tab */}
            <IfThen condition={selectedTab === TABS.GPU}>
              <TimeControlProvider allowPortal>
                <GpuDashboard node={node} />
              </TimeControlProvider>
            </IfThen>
            {/* Node Config Tab */}
            <IfThen condition={selectedTab === TABS.CONFIG}>
              <NodeMeta node={node} edgeHealth={edgeHealth} edge={edge} />
            </IfThen>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
});
