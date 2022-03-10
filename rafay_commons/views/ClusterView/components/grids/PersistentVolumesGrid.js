import React, { useContext } from "react";
import { Typography } from "@material-ui/core";
import {
  renderLabels,
  getZtkKubeAge,
  getKeyValuePair,
  renderClusterResourcesProperty,
  useQuery,
  renderLink,
  handleZtkResolution,
  mapAgeToRow,
  longEm
} from "../../../../utils";
import { ResourceFiltersContext } from "../ResourceFilters";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function PersistentVolumesGrid({ edge, project, match }) {
  const {
    applyResourceFilters,
    manualRefresh,
    refreshInterval,
    selectedFilters: { namespace }
  } = useContext(ResourceFiltersContext);
  const { query } = useQuery();
  const defaultSearchText = query.get("search") || "";

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      refreshInterval={refreshInterval}
      handleResolution={handleZtkResolution}
      // fetchArgs={[
      //   `info/pv/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get pv ${
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
            title={<Typography variant="h6">Persistent Volumes</Typography>}
            data={mapAgeToRow(data)}
            defaultSearchText={defaultSearchText}
            columns={[
              {
                label: "Name",
                dataKey: "name",
                dataGetter: ({ rowData }) => rowData.metadata.name
              },
              {
                label: "Capacity",
                dataKey: "capacity",
                dataGetter({ rowData }) {
                  return getKeyValuePair(rowData.spec?.capacity || []);
                },
                render({ cellData }) {
                  return renderClusterResourcesProperty(cellData);
                }
              },
              {
                label: "Access Modes",
                dataKey: "accessModes",
                dataGetter({ rowData }) {
                  return rowData.spec?.accessModes || [];
                },
                render({ cellData }) {
                  return renderLabels(cellData);
                }
              },

              {
                label: "Reclaim Policy",
                dataKey: "reclaimPolicy",
                dataGetter: ({ rowData }) =>
                  rowData.spec.persistentVolumeReclaimPolicy
              },
              {
                label: "Status",
                dataKey: "status",
                dataGetter: ({ rowData }) => rowData.status?.phase
              },
              {
                label: "Claim",
                dataKey: "claim",
                render({ rowData }) {
                  const cellData = rowData.spec?.claimRef?.name;
                  const url = `${match.url}/resources/pvc?search=${cellData}&view=Namespaces`;
                  return renderLink(cellData, url);
                }
              },
              {
                label: "Storage Class",
                dataKey: "storageClass",
                render({ rowData }) {
                  const cellData = rowData.spec?.storageClassName;
                  const url = `${match.url}/resources/cluster/storageclasses?search=${cellData}`;
                  return renderLink(cellData, url);
                }
              },
              {
                label: "Reason",
                dataKey: "reason",
                dataGetter: ({ rowData }) => rowData.status?.reason || longEm()
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

export default PersistentVolumesGrid;
