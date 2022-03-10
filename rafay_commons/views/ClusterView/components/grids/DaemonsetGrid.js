import React from "react";
import * as R from "ramda";
import { Typography, Box } from "@material-ui/core";

import Fetcher from "../../../../components/Fetcher";
import DataGrid from "../../../../components/DataGrid";
import {
  getZtkKubeAge,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import useHealth from "../useHealth";

function DaemonsetGrid({ edgeHash, project, edgeName, filterContext }) {
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
      // fetchArgs={[`info/daemonset/?edgeId=${edgeId}&namespace=${namespace}`]}
      fetchArgs={[
        `info/ztkquery/?edge=${edgeName}&project=${project}&query=get daemonset ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => {
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <DataGrid
              resetPageOnChange={status}
              data={applyFilters(data)}
              elevation={0}
              loading={loading}
              title={
                <Box display="flex" width="100%" mr={1}>
                  <Typography variant="h6">Daemonsets</Typography>
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
                  dataKey: "daemonset",
                  dataGetter: ({ rowData }) => rowData.metadata.name
                },
                {
                  label: "Ready",
                  dataKey: "healthyPods",
                  dataGetter: ({ rowData }) => rowData.status.numberReady,
                  render: ({ rowData, cellData }) =>
                    `${cellData}/${rowData.status?.desiredNumberScheduled || 0}`
                },
                {
                  label: "Age",
                  dataKey: "createdAt",
                  render({ rowData }) {
                    return getZtkKubeAge(rowData.metadata.creationTimestamp);
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

export default DaemonsetGrid;
