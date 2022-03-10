import React, { useContext } from "react";
import { Box, Grid } from "@material-ui/core";

import Fetcher from "components/Fetcher/Fetcher";
import { LineChart } from "components/Visualizations/LineChart";
import { longEm } from "utils";
import {
  xformPodRestartTs,
  xformContainerCpuTs,
  xformContainerHealthTs
} from "../cluster-view-helpers";
import { ClusterViewContext } from "../ClusterViewContexts";
import { TimeControlContext } from "./TimeControl";
import ChartCard from "./ChartCard";
import { ZoomTooltip } from "./cluster-view-commons";

export default function ContainerOverview({ container, containerRes, pod }) {
  const { edge } = useContext(ClusterViewContext);
  const { duration, interval } = useContext(TimeControlContext);
  const { qos, memoryRequest } = containerRes;
  const isBestEffort = qos === "BestEffort" || !memoryRequest;
  const requestStringForTitle = isBestEffort ? "" : " (Request)";
  // console.log("container", containerRes);
  // const { qos } = containerRes;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box height={280}>
          <Fetcher
            fetchArgs={[
              `container_metrics/${container}/health?edgeId=${edge.edge_id}&pod=${pod}&duration=${duration}&points=30`
            ]}
            handleResolution={xformContainerHealthTs(container)}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <ChartCard
                  loading={loading}
                  title={
                    <Box display="flex" alignItems="flex-start">
                      <span>Container Health</span>
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
              `container_metrics/${container}/cpu_details?duration=${duration}&edgeId=${edge.edge_id}&pod=${pod}&points=30`
            ]}
            handleResolution={xformContainerCpuTs(true, qos)}
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
              `container_metrics/${container}/memory_details?duration=${duration}&edgeId=${edge.edge_id}&pod=${pod}&points=30`
            ]}
            handleResolution={xformContainerCpuTs(false, qos)}
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
              `container_metrics/${container}/restarts?duration=${duration}&edgeId=${edge.edge_id}&pod=${pod}&points=30`
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
