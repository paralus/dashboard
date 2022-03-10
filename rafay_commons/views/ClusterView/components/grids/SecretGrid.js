import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import Fetcher from "../../../../components/Fetcher";
import DataGrid from "../../../../components/DataGrid";
import {
  getZtkKubeAge,
  handleZtkResolution,
  renderLabels,
  mapAgeToRow
} from "../../../../utils";

function SecretGrid({ edge, project, defaultSearchText, filterContext }) {
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
      // fetchArgs={[`info/secret/?edgeId=${edgeId}&namespace=${namespace}`]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get secrets ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => {
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <DataGrid
              elevation={0}
              showColumnSelector
              data={applyFilters(data)}
              loading={loading}
              title={<Typography variant="h6">Secrets</Typography>}
              defaultPageSize={10}
              defaultOrderBy="namespace"
              defaultSearchText={defaultSearchText}
              columns={[
                {
                  label: "Namespace",
                  dataKey: "namespace",
                  dataGetter: ({ rowData }) => rowData.metadata.namespace
                },
                {
                  label: "Name",
                  dataKey: "secret",
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
                  label: "Type",
                  dataKey: "type"
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

export default SecretGrid;
