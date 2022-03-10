import React from "react";
import * as R from "ramda";
import Typography from "@material-ui/core/Typography";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";
import {
  renderLabels,
  useQuery,
  renderLink,
  longEm,
  handleZtkResolution
} from "../../../../utils";

function PersistentVolumClaimGrid({ edge, project, match, filterContext }) {
  const {
    applyResourceFilters,
    applyZtkResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;
  const { query } = useQuery();
  const defaultSearchText = query.get("search") || "";
  // const applyFilters = R.pipe(applyZtkResourceFilters, mapAgeToRow);

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      refreshInterval={refreshInterval}
      // fetchArgs={[
      //   `info/pvc/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get pvc ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => (
        <DataGrid
          elevation={0}
          loading={loading}
          showColumnSelector
          title={<Typography variant="h6">Persistent Volume Claims</Typography>}
          data={applyZtkResourceFilters(data)}
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
              label: "Status",
              dataKey: "status",
              dataGetter: ({ rowData }) => rowData.status.phase
            },
            {
              label: "Volume",
              dataKey: "volume",
              dataGetter: ({ rowData }) => rowData.spec.volumeName,
              render({ cellData }) {
                const url = `${match.url}/resources/cluster/pv?search=${cellData}&view=Cluster&noRedirect=true`;
                return renderLink(cellData, url);
              }
            },
            {
              label: "Capacity",
              dataKey: "capacity",
              dataGetter: ({ rowData }) =>
                rowData.status.capacity?.storage || longEm()
            },
            {
              label: "Access Modes",
              dataKey: "accessModes",
              dataGetter({ rowData }) {
                return rowData.status.accessModes || [];
              },
              render({ cellData }) {
                return renderLabels(cellData);
              }
            },
            {
              label: "Storage Class",
              dataKey: "storageClass",
              dataGetter: ({ rowData }) => rowData.spec.storageClassName,
              render({ cellData }) {
                const url = `${match.url}/resources/cluster/storageclasses?search=${cellData}&view=Cluster&noRedirect=true`;
                return renderLink(cellData, url);
              }
            }
          ]}
        />
      )}
    </Fetcher>
  );
}

export default PersistentVolumClaimGrid;
