import { Box, Grid, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";

import { isSomething, useQuery, useAPI } from "../../../utils";
import Spinner from "components/Spinner/Spinner";
import { ClusterViewContext } from "../ClusterViewContexts";
import { TimeControlProvider } from "./TimeControl";
import PodOverview from "./PodOverview";
import PodHeader from "./PodHeader";
import PodMeta from "./PodMeta";
import IfThen from "./IfThen";
import EmptyScreen from "../../../components/EmptyScreen";

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

export default function PodDetails({ match, history }) {
  const { edge, setTrackerMatch } = useContext(ClusterViewContext);
  const { query } = useQuery();
  const namespace = query.get("namespace");

  if (!edge) return null;

  const classes = useStyles();
  const [showMeta, setShowMeta] = useState(false);
  const { loading, data: pod } = useAPI({
    initialData: {},
    refreshInterval: 30,
    args: [
      `info/pod/${match.params.pod}?edgeId=${edge.edge_id}&namespace=${namespace}`
    ],
    handleResolution: data => {
      if (data.length) return data[0];
      return {};
    }
  });

  const handleMetaToggle = (e, index) => {
    setShowMeta(index === 1);
  };

  useEffect(() => {
    setTrackerMatch(match);
  }, []);

  return (
    <Spinner hideChildren loading={loading}>
      <IfThen condition={isSomething(pod)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PodHeader resource={pod} title={pod.pod} />
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.details}>
              <Paper elevation={0} className={classes.tabs}>
                <Tabs
                  value={showMeta ? 1 : 0}
                  onChange={handleMetaToggle}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  {[
                    { key: "overview", label: "Overview" },
                    { key: "config", label: "Configuration" }
                  ].map(({ key, label }) => (
                    <Tab
                      disableRipple
                      key={key}
                      label={label}
                      classes={{
                        root: classes.tab,
                        wrapper: classes.tabWrapper
                      }}
                    />
                  ))}
                </Tabs>
              </Paper>
              <Box p={2}>
                <IfThen condition={showMeta}>
                  <PodMeta pod={pod} podDetailMatch={match} />
                </IfThen>
                <IfThen condition={!showMeta}>
                  <TimeControlProvider>
                    <PodOverview pod={pod} />
                  </TimeControlProvider>
                </IfThen>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </IfThen>
      <IfThen condition={!isSomething(pod)}>
        <EmptyScreen title="404: Pod not found" />
      </IfThen>
    </Spinner>
  );
}
