import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import {
  getZtkKubeAge,
  renderClusterResourcesProperty,
  getKeyValuePair,
  renderLabels,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function ConfigMapGrid({ edge, project, defaultSearchText, filterContext }) {
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
      //   `info/configmap/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get configmap ${
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
            title={<Typography variant="h6">Config Maps</Typography>}
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
                dataGetter({ rowData }) {
                  return getKeyValuePair(rowData.parameters || []);
                },
                render({ cellData }) {
                  return renderClusterResourcesProperty(cellData);
                }
              },
              {
                label: "Data Keys",
                dataKey: "keys",
                cellStyle: {
                  whiteSpace: "initial",
                  maxWidth: 200
                },
                render({ rowData }) {
                  const cellData = Object.keys(rowData.data || {});
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

export default ConfigMapGrid;
