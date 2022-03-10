import React from "react";
import * as R from "ramda";
import { Typography, Box } from "@material-ui/core";

import Fetcher from "../../../../components/Fetcher";
import DataGrid from "../../../../components/DataGrid";
import {
  getZtkKubeAge,
  renderLabels,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";

import RadioButtons from "../RadioButtons";
import useHealth from "../useHealth";

function StatefulSetGrid({ project, edgeId, edgeName, filterContext }) {
  const { status, statusOptions, updateStatus, filterByHealth } = useHealth();
  const {
    applyResourceFilters,
    applyZtkResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;

  const applyFilters = R.pipe(applyZtkResourceFilters, mapAgeToRow);
  // const applyFilters = data => {
  //   if (!data) return [];
  //   let rData = data;
  //   if (status === "healthy")
  //     rData = rData.filter(a => a.status.phase === "Running");
  //   if (status === "unhealthy")
  //     rData = rData.filter(a => a.status.phase !== "Running");
  //   return rData;
  // };

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      refreshInterval={refreshInterval}
      handleResolution={handleZtkResolution}
      // fetchArgs={[`info/statefulset/?edgeId=${edgeId}&namespace=${namespace}`]}
      fetchArgs={[
        `info/ztkquery/?edge=${edgeName}&project=${project}&query=get statefulset ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => {
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <DataGrid
              resetPageOnChange={status}
              elevation={0}
              data={applyFilters(data)}
              loading={loading}
              showColumnSelector
              title={
                <Box display="flex" width="100%" mr={1}>
                  <Typography variant="h6">Stateful Sets</Typography>
                  <div style={{ flex: 1 }} />
                  {/* <RadioButtons
                    value={status}
                    options={statusOptions}
                    onClick={updateStatus}
                  /> */}
                </Box>
              }
              defaultPageSize={10}
              defaultOrder="asc"
              defaultOrderBy="namespace"
              columns={[
                {
                  label: "Namespace",
                  dataKey: "namespace",
                  dataGetter: ({ rowData }) => rowData.metadata.namespace
                },
                {
                  label: "Name",
                  dataKey: "statefulset",
                  dataGetter: ({ rowData }) => rowData.metadata.name
                },
                {
                  label: "Labels",
                  dataKey: "labels",
                  defaultChecked: false,
                  cellStyle: {
                    whiteSpace: "initial"
                  },
                  dataGetter: ({ rowData }) => {
                    const labels = rowData.metadata.labels || [];
                    return Object.keys(labels).map(k => `${k}:${labels[k]}`);
                  },
                  render({ cellData }) {
                    return renderLabels(cellData);
                  }
                },
                {
                  label: "Images",
                  dataKey: "images",
                  cellStyle: {
                    whiteSpace: "initial"
                  },
                  dataGetter({ rowData }) {
                    return (
                      rowData.spec.template?.spec?.containers?.map(
                        c => c.image
                      ) || []
                    );
                  },
                  render({ cellData }) {
                    return renderLabels(cellData);
                  }
                },
                {
                  label: "Ready",
                  dataKey: "healthyPods",
                  render: ({ rowData }) => {
                    const { readyReplicas = 0, replicas = 0 } =
                      rowData.status || {};
                    return `${readyReplicas}/${replicas}`;
                  }
                },
                {
                  label: "Age",
                  dataKey: "createdAt",
                  render({ rowData }) {
                    return getZtkKubeAge(rowData.createdAt);
                  }
                }
              ]}
            />
          </div>
        );
      }}
    </Fetcher>
  );
}

export default StatefulSetGrid;
