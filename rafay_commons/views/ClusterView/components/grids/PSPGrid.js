import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import {
  renderClusterResourcesProperty,
  getZtkKubeAge,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import { ResourceFiltersContext } from "../ResourceFilters";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function PSPGrid({ edge, project, defaultSearchText }) {
  const {
    applyResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = useContext(ResourceFiltersContext);

  return (
    <Fetcher
      refreshInterval={refreshInterval}
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      // fetchArgs={[
      //   `info/psp/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get psp ${
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
            title={<Typography variant="h6">PSP</Typography>}
            data={mapAgeToRow(data)}
            defaultSearchText={defaultSearchText}
            columns={[
              {
                label: "Name",
                dataKey: "name",
                dataGetter: ({ rowData }) => rowData.metadata.name
              },
              {
                label: "Privileged",
                dataKey: "privileged",
                dataGetter: ({ rowData }) =>
                  rowData.spec.privileged ? "true" : "false"
              },
              {
                label: "seLinux",
                dataKey: "seLinux",
                dataGetter: ({ rowData }) => rowData.spec.seLinux.rule
              },
              {
                label: "RunAsUser",
                dataKey: "runAsUser",
                dataGetter: ({ rowData }) => rowData.spec.runAsUser.rule
              },
              {
                label: "FsGroup",
                dataKey: "fsGroup",
                dataGetter: ({ rowData }) => rowData.spec.fsGroup.rule
              },
              {
                label: "Volumes",
                dataKey: "volumes",
                cellStyle: {
                  whiteSpace: "initial",
                  maxWidth: 200
                },
                dataGetter: ({ rowData }) => rowData.spec.volumes,
                render: ({ cellData }) =>
                  renderClusterResourcesProperty(cellData)
              },
              {
                label: "Age",
                dataKey: "createdAt",
                render: ({ rowData }) => getZtkKubeAge(rowData.createdAt)
              }
            ]}
          />
        );
      }}
    </Fetcher>
  );
}

export default PSPGrid;
