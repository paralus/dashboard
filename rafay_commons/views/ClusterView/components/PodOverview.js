import React, { useContext } from "react";
import { Box, Grid } from "@material-ui/core";

import { LineChart } from "components/Visualizations/LineChart";
import { longEm } from "utils";
import {
  xformPodCpuTs,
  xformPodMemoryTs,
  xformPodHealthTs,
  xformPodRestartTs
} from "../cluster-view-helpers";
import { ClusterViewContext } from "../ClusterViewContexts";
import Fetcher from "../../../components/Fetcher";
import { TimeControlContext } from "./TimeControl";
import ChartCard from "./ChartCard";
import { ZoomTooltip } from "./cluster-view-commons";

export default function PodOverview({ pod }) {
  const { edge } = useContext(ClusterViewContext);
  const { duration, interval } = useContext(TimeControlContext);
  const { qos, memoryRequest } = pod;
  const isBestEffort = qos === "BestEffort" || !memoryRequest;
  const requestStringForTitle = isBestEffort ? "" : " (Request)";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `pod_metrics/${pod.pod}/health?edgeId=${edge.edge_id}&duration=${duration}&points=30`
            ]}
            handleResolution={xformPodHealthTs(pod.pod)}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title={
                    <Box display="flex" alignItems="flex-start">
                      <span>Pod Health</span>
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
              `pod_metrics/${pod.pod}/cpu_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformPodCpuTs(pod)}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title={`CPU Utilization${requestStringForTitle}`}
                  chips={[
                    {
                      key: "CURR",
                      label: data.current
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
              `pod_metrics/${pod.pod}/memory_details?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformPodMemoryTs(pod)}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title={`Memory Utilization${requestStringForTitle}`}
                  chips={[
                    {
                      key: "CURR",
                      label: data.current
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
              `pod_metrics/${pod.pod}/restarts?duration=${duration}&edgeId=${edge.edge_id}&points=30`
            ]}
            handleResolution={xformPodRestartTs}
            refreshInterval={interval}
          >
            {({ data = {}, loading }) => {
              return (
                <ChartCard loading={loading} title="Restarts">
                  <LineChart config={data} style={{ height: "100%" }} />
                </ChartCard>
              );
            }}
          </Fetcher>
        </Box>
      </Grid>
    </Grid>
  );
}
