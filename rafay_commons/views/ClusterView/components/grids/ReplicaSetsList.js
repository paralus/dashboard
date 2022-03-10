import React from "react";
import * as R from "ramda";
import { Typography, Box } from "@material-ui/core";

import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";
import {
  renderLabels,
  getZtkKubeAge,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import RadioButtons from "../RadioButtons";
import useHealth from "../useHealth";

function ReplicaSets({ project, edgeId, edgeName, filterContext }) {
  const { status, statusOptions, updateStatus, filterByHealth } = useHealth();
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
      // fetchArgs={[`info/replicaset/?edgeId=${edgeId}&namespace=${namespace}`]}
      fetchArgs={[
        `info/ztkquery/?edge=${edgeName}&project=${project}&query=get replicaset ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => (
        <DataGrid
          resetPageOnChange={status}
          loading={loading}
          elevation={0}
          defaultOrder="asc"
          defaultOrderBy="namespace"
          showColumnSelector
          title={
            <Box display="flex" width="100%" mr={1}>
              <Typography variant="h6">Replica Sets</Typography>
              <div style={{ flex: 1 }} />
              {/* <RadioButtons
                value={status}
                options={statusOptions}
                onClick={updateStatus}
              /> */}
            </Box>
          }
          data={applyFilters(data)}
          columns={[
            {
              label: "Namespace",
              dataKey: "namespace",
              dataGetter: ({ rowData }) => rowData.metadata.namespace
            },
            {
              label: "Name",
              dataKey: "replicaset",
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
                maxWidth: 500,
                whiteSpace: "initial"
              },
              dataGetter({ rowData }) {
                return (
                  rowData.spec.template?.spec?.containers?.map(c => c.image) ||
                  []
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
      )}
    </Fetcher>
  );
}

export default ReplicaSets;
