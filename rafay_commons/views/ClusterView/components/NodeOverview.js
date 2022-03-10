import React, { useContext } from "react";
import { Box, Grid } from "@material-ui/core";

import { LineChart } from "components/Visualizations/LineChart";
import { longEm } from "utils";
import Fetcher from "../../../components/Fetcher";
import {
  xformClusterCpuTs,
  xformClusterMemoryTs,
  xformClusterStorageTs,
  xformNodeHealthTs,
  xformPodHealthCountTs
} from "../cluster-view-helpers";
import { ClusterViewContext } from "../ClusterViewContexts";
import { TimeControlContext } from "./TimeControl";
import ChartCard from "./ChartCard";
import { ZoomTooltip } from "./cluster-view-commons";

export default function NodeOverview({ node }) {
  const { edge } = useContext(ClusterViewContext);
  const { duration, interval } = useContext(TimeControlContext);
  const nodeNameForURL = node?.hostname?.toLowerCase() || node.name;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `node_metrics/${nodeNameForURL}/health?edgeId=${edge.edge_id}&duration=${duration}&points=30`
            ]}
            handleResolution={xformNodeHealthTs(nodeNameForURL)}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title={
                    <Box display="flex" alignItems="flex-start">
                      <span>Node Health</span>
                      <ZoomTooltip />
                    </Box>
                  }
                >
                  <LineChart config={data} style={{ height: "100%" }} />
                </ChartCard>
              );
            }}
          </Fetcher>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `/pod_metrics/health?duration=${duration}&edgeId=${edge.edge_id}&node=${nodeNameForURL}&points=30`
            ]}
            handleResolution={xformPodHealthCountTs}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title="Pod Count by Status"
                  chips={[
                    {
                      key: "Running",
                      label: `Running ${longEm(data.running)}`
                    },
                    {
                      key: "Error",
                      label: `Error ${longEm(data.error)}`
                    }
                  ]}
                >
                  <LineChart config={data.series} style={{ height: "100%" }} />
                </ChartCard>
              );
            }}
          </Fetcher>
        </Box>
      </Grid>

      <Grid item xs={4}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `node_metrics/${nodeNameForURL}/cpu_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformClusterCpuTs}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title="CPU Utilization"
                  chips={[
                    {
                      key: "CURR",
                      label: `CURR ${longEm(data.current)}`
                    },
                    {
                      key: "PEAK",
                      label: `PEAK ${longEm(data.max)}`
                    },
                    {
                      key: "AVG",
                      label: `AVG ${longEm(data.average)}`
                    }
                  ]}
                >
                  <LineChart config={data.series} style={{ height: "100%" }} />
                </ChartCard>
              );
            }}
          </Fetcher>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `node_metrics/${nodeNameForURL}/memory_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformClusterMemoryTs}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title="Memory Utilization"
                  chips={[
                    {
                      key: "CURR",
                      label: `CURR ${longEm(data.current)}`
                    },
                    {
                      key: "PEAK",
                      label: `PEAK ${longEm(data.max)}`
                    },
                    {
                      key: "AVG",
                      label: `AVG ${longEm(data.average)}`
                    }
                  ]}
                >
                  <LineChart config={data.series} style={{ height: "100%" }} />
                </ChartCard>
              );
            }}
          </Fetcher>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `node_metrics/${nodeNameForURL}/storage_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformClusterStorageTs}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title="Storage Utilization"
                  chips={[
                    {
                      key: "CURR",
                      label: `CURR ${longEm(data.current)}`
                    },
                    {
                      key: "PEAK",
                      label: `PEAK ${longEm(data.max)}`
                    },
                    {
                      key: "AVG",
                      label: `AVG ${longEm(data.average)}`
                    }
                  ]}
                >
                  <LineChart config={data.series} style={{ height: "100%" }} />
                </ChartCard>
              );
            }}
          </Fetcher>
        </Box>
      </Grid>
    </Grid>
  );
}
