import { Grid, Box, Link } from "@material-ui/core";
import * as R from "ramda";
import React, { useEffect, useContext } from "react";
import { longEm, getKubeAge, applyFormatter } from "utils";
import { Link as RouterLink } from "react-router-dom";
import MetaItem from "./MetaItem";
import { ClusterViewContext } from "../ClusterViewContexts";

const getFormattedValue = isCPU => {
  return function(value) {
    if (value < 0) return longEm();
    const format = isCPU ? "0.00a" : "0.0 B";
    const units = isCPU ? " cores" : "";
    return `${applyFormatter(format, value)}${units}`;
  };
};

const getCpuUsage = value => {
  const { cpuUsage, cpuRequest } = value;

  if (cpuUsage === -1) return longEm();
  if (cpuUsage === 0 || cpuRequest === 0) return "0 (0%)";
  if (cpuRequest >= 0 && cpuUsage) {
    const pValue = cpuUsage / cpuRequest;
    const percent = applyFormatter("0.0%", pValue);
    return `${applyFormatter("0.00a", cpuUsage)} cores (${percent})`;
  }
  if (cpuUsage) {
    return `${applyFormatter("0.00a", cpuUsage)} cores`;
  }
  return longEm();
};

const getMemoryUsage = value => {
  const { memoryUsage, memoryRequest } = value;

  if (memoryUsage === -1) return longEm();
  if (memoryUsage === 0 || memoryRequest === 0) return "0 (0%)";
  if (memoryRequest >= 0 && memoryUsage) {
    const pValue = memoryUsage / memoryRequest;
    const percent = applyFormatter("0.0%", pValue);
    return `${applyFormatter("0.0 B", memoryUsage)} (${percent})`;
  }
  if (memoryUsage) {
    return `${applyFormatter("0.0 B", memoryUsage)}`;
  }
  return longEm();
};

const ContainerItem = ({ pod, match, container, namespace }) => {
  return (
    <Link
      component={RouterLink}
      to={`${match.url}/containers/${container}?namespace=${namespace}`}
    >
      {container}
    </Link>
  );
};

export default function PodMeta({ pod, podDetailMatch }) {
  const { setPodContainers } = useContext(ClusterViewContext);

  const getFormattedValueMemory = getFormattedValue(false);
  const getFormattedValueCPU = getFormattedValue(true);
  const { containerReasons = {}, containers = {} } = pod;
  const containerCount = R.keys(containers).length;
  const badContainerCount = R.values(containerReasons).length;
  const ready = `${containerCount - badContainerCount}/${containerCount}`;
  const podContainers = Object.keys(pod.containers || {});

  useEffect(() => {
    setPodContainers(podContainers);
  }, []);

  return (
    <Box p={1 / 2}>
      <Grid container spacing={1}>
        <MetaItem label="Namespace" value={pod.namespace} />
        <MetaItem
          label="Containers"
          alignItems="flex-start"
          // value={Object.keys(pod.containers || {}).join(", ")}
          value={podContainers.map(container => (
            <div>
              <ContainerItem
                pod={pod.pod}
                match={podDetailMatch}
                container={container}
                namespace={pod.namespace}
              />
            </div>
          ))}
        />
        <MetaItem label="Pod Phase" value={pod.phase} />
        <MetaItem label="Ready" value={ready} />
        <MetaItem label="QoS" value={pod.qos} />
        <MetaItem label="Restarts" value={pod.restarts} />
        <MetaItem label="Age" value={getKubeAge(pod.createdAt)} />
        <MetaItem
          label="CPU (Request)"
          value={getFormattedValueCPU(pod.cpuRequest || -1)}
        />
        <MetaItem
          label="CPU (Limit)"
          value={getFormattedValueCPU(pod.cpuLimit || -1)}
        />
        <MetaItem label="CPU Usage (% of Request)" value={getCpuUsage(pod)} />
        <MetaItem
          label="Memory (Request)"
          value={getFormattedValueMemory(pod.memoryRequest || -1)}
        />
        <MetaItem
          label="Memory (Limit)"
          value={getFormattedValueMemory(pod.memoryLimit || -1)}
        />
        <MetaItem
          label="Memory Usage (% of Request)"
          value={getMemoryUsage(pod)}
        />
      </Grid>
    </Box>
  );
}
