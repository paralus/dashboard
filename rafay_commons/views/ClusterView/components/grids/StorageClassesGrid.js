import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import {
  getZtkKubeAge,
  renderClusterResourcesProperty,
  getKeyValuePair,
  useQuery,
  handleZtkResolution,
  longEm,
  mapAgeToRow
} from "../../../../utils";
import { ResourceFiltersContext } from "../ResourceFilters";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function StorageClassesGrid({ edge, project }) {
  const {
    applyResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = useContext(ResourceFiltersContext);
  const { query } = useQuery();
  const defaultSearchText = query.get("search") || "";

  return (
    <Fetcher
      refreshInterval={refreshInterval}
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      // fetchArgs={[
      //   `info/storageclass/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get storageclass ${
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
            title={<Typography variant="h6">Storage Classes</Typography>}
            data={mapAgeToRow(data)}
            defaultSearchText={defaultSearchText}
            columns={[
              {
                label: "Name",
                dataKey: "name",
                dataGetter: ({ rowData }) => rowData.metadata.name
              },
              {
                label: "Provisioner",
                dataKey: "provisioner"
              },
              {
                label: "Reclaim Policy",
                dataKey: "reclaimPolicy"
              },
              {
                label: "Default",
                dataKey: "isDefault",
                dataGetter({ rowData }) {
                  return (
                    rowData.metadata.annotations?.[
                      "storageclass.kubernetes.io/is-default-class"
                    ] || longEm()
                  );
                }
              },
              {
                label: "Parameters",
                dataKey: "parameters",
                dataGetter({ rowData }) {
                  return getKeyValuePair(rowData.parameters || []);
                },
                render({ cellData }) {
                  return renderClusterResourcesProperty(cellData);
                }
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

export default StorageClassesGrid;
