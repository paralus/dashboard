import React, { useEffect, useContext } from "react";
import { ClusterViewContext } from "../ClusterViewContexts";
import Spinner from "components/Spinner/Spinner";
import { Box, Grid, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import ContainerHeader from "./ContainerHeader";
import { isSomething, useQuery, useAPI } from "../../../utils";
import { TimeControlProvider } from "./TimeControl";
import ContainerOverview from "./ContainerOverview";
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

export default function ContainerDetails({ match, history }) {
  const { edge, setTrackerMatch } = useContext(ClusterViewContext);
  const { query } = useQuery();
  const namespace = query.get("namespace");

  if (!edge) return null;
  const classes = useStyles();

  const { loading, data: container } = useAPI({
    initialData: {},
    refreshInterval: 30,
    args: [
      `info/container/${match.params.container}?edgeId=${edge.edge_id}&namespace=${namespace}`
    ],
    handleResolution: data => {
      if (data.length) return data[0];
      return {};
    }
  });

  useEffect(() => {
    setTrackerMatch(match);
  }, [container]);

  return (
    <Spinner hideChildren loading={loading}>
      {/* <IfThen condition={isSomething(pod)}> */}
      <IfThen condition={true}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ContainerHeader
              history={history}
              match={match}
              resource={{ containerStatus: container.containerStatus }}
              title={container.container}
            />
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.details}>
              <Paper elevation={0} className={classes.tabs}>
                <Tabs
                  value={0}
                  // onChange={handleMetaToggle}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  {[{ key: "overview", label: "Overview" }].map(
                    ({ key, label }) => (
                      <Tab
                        disableRipple
                        key={key}
                        label={label}
                        classes={{
                          root: classes.tab,
                          wrapper: classes.tabWrapper
                        }}
                      />
                    )
                  )}
                </Tabs>
              </Paper>
              <Box p={2}>
                <TimeControlProvider>
                  <ContainerOverview
                    pod={match.params.pod}
                    container={match.params.container}
                    containerRes={container}
                  />
                </TimeControlProvider>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </IfThen>
      {/* <IfThen condition={!isSomething(pod)}>
        <EmptyScreen title="404: Pod not found" />
      </IfThen> */}
    </Spinner>
  );
}
