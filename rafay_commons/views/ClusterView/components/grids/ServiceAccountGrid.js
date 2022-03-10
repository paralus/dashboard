import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import {
  renderLabels,
  getZtkKubeAge,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function ServiceAccountGrid({
  edge,
  project,
  defaultSearchText,
  filterContext
}) {
  const {
    applyResourceFilters,
    applyZtkResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;

  const applyFilters = R.pipe(applyZtkResourceFilters, mapAgeToRow);

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      refreshInterval={refreshInterval}
      handleResolution={handleZtkResolution}
      // fetchArgs={[
      //   `info/serviceaccount/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get serviceaccount ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => {
        return (
          <DataGrid
            elevation={0}
            loading={loading}
            defaultOrder="asc"
            defaultOrderBy="namespace"
            showColumnSelector
            title={<Typography variant="h6">Service Accounts</Typography>}
            data={applyFilters(data)}
            defaultSearchText={defaultSearchText}
            columns={[
              {
                label: "Namespace",
                dataKey: "namespace",
                dataGetter: ({ rowData }) => rowData.metadata.namespace
              },
              {
                label: "Name",
                dataKey: "name",
                dataGetter: ({ rowData }) => rowData.metadata.name
              },
              {
                label: "Labels",
                dataKey: "labels",
                defaultChecked: false,
                cellStyle: {
                  width: 500,
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
                  return getZtkKubeAge(rowData.createdAt);
                }
              }
            ]}
          />
        );
      }}
    </Fetcher>
  );
}

export default ServiceAccountGrid;
