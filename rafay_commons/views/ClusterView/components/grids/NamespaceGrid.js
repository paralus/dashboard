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

import useHealth from "../useHealth";
import RadioButtons from "../RadioButtons";

function NamespaceGrid({ project, edge, edgeName, filterContext }) {
  const { status, statusOptions, updateStatus, filterByHealth } = useHealth();
  const {
    // applyResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;
  const applyResourceFilters = data => {
    if (!data) return [];
    let rData = data;
    if (namespace && namespace !== "All") {
      rData = rData.filter(a => a.metadata.name === namespace);
    }
    return rData;
  };
  const applyFilters = R.pipe(applyResourceFilters, mapAgeToRow);

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      refreshInterval={refreshInterval}
      // fetchArgs={[`info/namespace/${selectedNamespace}?edgeId=${edgeId}`]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get namespace ${
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
              showColumnSelector
              data={applyFilters(data)}
              loading={loading}
              title={
                <Box display="flex" width="100%" mr={1}>
                  <Typography variant="h6">Namespaces</Typography>
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
                  label: "Name",
                  dataKey: "namespace",
                  dataGetter: ({ rowData }) => rowData.metadata.name
                },
                {
                  label: "Phase",
                  dataKey: "phase",
                  dataGetter: ({ rowData }) => rowData.status.phase
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

export default NamespaceGrid;
