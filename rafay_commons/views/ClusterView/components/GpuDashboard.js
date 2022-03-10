import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Box, Grid } from "@material-ui/core";
import { MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import ChartCard from "./ChartCard";
import GaugeChart from "rafay_commons/components/charts/GaugeChart";
import LineChart from "../../../components/charts/LineChart";
import Fetcher from "../../../components/Fetcher";
import { TimeControlContext } from "./TimeControl";
import { ClusterViewContext } from "../ClusterViewContexts";
import {
  gpuMemClockOptions,
  gpuSMClocks,
  gpuClockValue,
  gpuPower,
  gpuMemoryCopyUtilization,
  gpuFramebufferMemory,
  gpuUtilization,
  gpuTemperature
} from "../gpu-helpers";

const guage_graph_cl = 2;
const top_line_graph_cl = 5;
const bottom_line_graph_cl = 6;

const handleGpuInfoResolution = res => {
  if (res.length) {
    const data = res.map(r => r.metric);
    return data[0];
  }
  return;
};

const getGpuOptions = count =>
  Array(count)
    .fill("")
    .map((c, i) => ({ label: `gpu-${i}`, value: i }));

function GpuSelector({ value, options, onChange }) {
  return (
    <FormControl size="small" variant="outlined" style={{ width: 200 }}>
      <InputLabel id="gpu-selector-label">GPU Selector</InputLabel>
      <Select
        displayEmpty
        id="gpu-selector"
        labelId="gpu-selector-label"
        value={value}
        onChange={e => onChange(e.target.value)}
        label="GPU Selector"
      >
        {options.map(option => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function GPUCard(props) {
  const { loading, title, children } = props;
  return (
    <Box height={280}>
      <ChartCard
        loading={loading}
        title={
          <Box display="flex" alignItems="flex-start">
            <span>{title}</span>
          </Box>
        }
      >
        {children && children}
      </ChartCard>
    </Box>
  );
}

function TopCard(props) {
  const { title, value } = props;
  return (
    <div
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 4,
        borderLeft: "5px solid teal",
        textAlign: "center",
        padding: 8,
        display: "flex",
        justifyContent: "space-around"
      }}
    >
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>{title}</h1>
      <h1 style={{ margin: 0 }}>{value}</h1>
    </div>
  );
}

function GpuDashboard({ node, edge, selectedGpu }) {
  const { duration, interval, portalNode } = useContext(TimeControlContext);
  if (!edge) {
    const { edge: edgeFromContext } = useContext(ClusterViewContext);
    edge = edgeFromContext;
  }
  const nodeNameForURL = node?.hostname?.toLowerCase() || node.name;
  const gpuOptions = getGpuOptions(node.num_gpus);
  const [selectedGPU, setSelectedGPU] = useState(
    selectedGpu || gpuOptions[0]?.value
  );

  return (
    <>
      {!!portalNode &&
        ReactDOM.createPortal(
          <GpuSelector
            options={gpuOptions}
            onChange={setSelectedGPU}
            value={selectedGPU}
          />,
          portalNode
        )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_info?edgeId=${edge.edge_id}&gpu=${selectedGPU}`
            ]}
            refreshInterval={interval}
            handleResolution={handleGpuInfoResolution}
          >
            {({ data, loading }) => {
              return (
                <p
                  style={{
                    fontSize: 20,
                    margin: 0,
                    fontWeight: 500,
                    marginLeft: 5
                  }}
                >
                  <span className="mr-1">Pod :</span>
                  {data?.pod ? (
                    <Link
                      component={RouterLink}
                      to={`/app/edges/${edge.id}/resources/pods?search=${data.pod}`}
                    >
                      {data.pod}
                    </Link>
                  ) : (
                    <span style={{ color: "teal" }}>-</span>
                  )}
                </p>
              );
            }}
          </Fetcher>
        </Grid>
        {/**
         * Current GPU  SM Clocks
         * Top left Widget
         */}
        <Grid item xs={6}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_sm_clocks?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuClockValue}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return <TopCard title={"Current GPU  SM Clocks"} value={data} />;
            }}
          </Fetcher>
        </Grid>

        {/**
         * Current GPU Memory Clocks
         * Top right Widget
         */}
        <Grid item xs={6}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_mem_clocks?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuClockValue}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <TopCard title={"Current GPU Memory Clocks"} value={data} />
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * GPU Utilization
         */}
        <Grid item xs={top_line_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_utilization?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuUtilization}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard title={"GPU Utilization"} loading={loading}>
                  <LineChart options={data} />
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * GPU Memory cpy Utilization
         */}
        <Grid item xs={top_line_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_memory_copy_utilization?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuMemoryCopyUtilization}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard
                  title={"GPU Memory Copy Utilization"}
                  loading={loading}
                >
                  <LineChart options={data} />;
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * GPU Avg. Temperature
         * Guage widget
         */}
        <Grid item xs={guage_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_temp?edgeId=${edge.edge_id}&gpu=${selectedGPU}`
            ]}
            handleResolution={gpuTemperature}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard title={"GPU Avg. Temperature"} loading={loading}>
                  <GaugeChart options={data} noMergeOptions />
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * GPU SM Clocks
         */}
        <Grid item xs={top_line_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_sm_clocks?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuSMClocks}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard title={"GPU SM Clocks"} loading={loading}>
                  <LineChart options={data} />
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * GPU Memory Clocks
         */}
        <Grid item xs={top_line_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_mem_clocks?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuMemClockOptions}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard title={"GPU Memory Clocks"} loading={loading}>
                  <LineChart options={data} />
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * GPU Power Tool
         * Guage Widget
         */}
        <Grid item xs={guage_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/gpu_power_usage?edgeId=${edge.edge_id}&gpu=${selectedGPU}`
            ]}
            handleResolution={gpuPower}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard title={"GPU Power Tool"} loading={loading}>
                  <GaugeChart options={data} />
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * Framebuffer Memory Used
         */}
        <Grid item xs={bottom_line_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/framebuffer_memory_used?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuFramebufferMemory("Used")}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard title={"Framebuffer Memory Used"} loading={loading}>
                  <LineChart options={data} />
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>

        {/**
         * Framebuffer Memory Free
         */}
        <Grid item xs={bottom_line_graph_cl}>
          <Fetcher
            fetchArgs={[
              `node_gpu_metrics/${nodeNameForURL}/framebuffer_memory_free?edgeId=${edge.edge_id}&gpu=${selectedGPU}&duration=${duration}&points=30`
            ]}
            handleResolution={gpuFramebufferMemory("Free")}
            refreshInterval={interval}
          >
            {({ data, loading }) => {
              return (
                <GPUCard title={"Framebuffer Memory Free"} loading={loading}>
                  <LineChart options={data} />
                </GPUCard>
              );
            }}
          </Fetcher>
        </Grid>
      </Grid>
    </>
  );
}

export default GpuDashboard;
