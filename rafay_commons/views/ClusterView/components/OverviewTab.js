import React, { useContext } from "react";
import { Box, Grid } from "@material-ui/core";

import Fetcher from "../../../components/Fetcher";
import { LineChart } from "components/Visualizations/LineChart";
import { longEm } from "utils";
import {
  xformClusterCpuTs,
  xformClusterHealthTs,
  xformClusterMemoryTs,
  xformClusterStorageTs,
  xformNodeHealthCountTs,
  xformPodHealthCountTs,
  xformWorkloadHealthCountTs
} from "../cluster-view-helpers";
import { ClusterViewContext } from "../ClusterViewContexts";
import { TimeControlContext } from "./TimeControl";
import ChartCard from "./ChartCard";
import { ZoomTooltip } from "./cluster-view-commons";

export default function OverviewTab({ history, match }) {
  const { edge } = useContext(ClusterViewContext);
  const { duration, interval } = useContext(TimeControlContext);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[`cluster/${edge.id}/health?timefrom=${duration}`]}
            handleResolution={xformClusterHealthTs}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title={
                    <Box display="flex" alignItems="flex-start">
                      <span>Cluster Health</span>
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
      <Grid item xs={4}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `cluster_metrics/cpu_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
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
              `cluster_metrics/memory_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
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
              `cluster_metrics/storage_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
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
      <Grid item xs={4}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `node_metrics/health?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformNodeHealthCountTs}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title="Node Count by Status"
                  chips={[
                    {
                      key: "Ready",
                      label: `Ready ${longEm(data.ready)}`
                    },
                    {
                      key: "Not Ready",
                      label: `Not Ready ${longEm(data.notReady)}`
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
              `workload_metrics/health?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformWorkloadHealthCountTs}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title="Workload Count by Status"
                  chips={[
                    {
                      key: "Ready",
                      label: `Ready: ${longEm(data.ready)}`,
                      onClick: () => {
                        history.push(
                          `${match.url}/resources/workloads?status=healthy&view=Workloads&workload=All`
                        );
                      }
                    },
                    {
                      key: "Not Ready",
                      label: `Not Ready: ${longEm(data.notReady)}`,
                      onClick: () => {
                        history.push(
                          `${match.url}/resources/workloads?status=unhealthy&view=Workloads&workload=All`
                        );
                      }
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
              `pod_metrics/health?duration=${duration}&edgeId=${edge.edge_id}&points=30`
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
                      label: `Running: ${longEm(data.running)}`,
                      onClick: () => {
                        history.push(
                          `${match.url}/resources/pods?status=healthy&namespace=All`
                        );
                      }
                    },
                    {
                      key: "Error",
                      label: `Error: ${longEm(data.error)}`,
                      onClick: () => {
                        history.push(
                          `${match.url}/resources/pods?status=unhealthy&namespace=All`
                        );
                      }
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
