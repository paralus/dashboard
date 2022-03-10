import React from "react";
import * as R from "ramda";
import { Typography, Box } from "@material-ui/core";

import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";
import {
  getZtkKubeAge,
  handleZtkResolution,
  mapAgeToRow,
  renderLabels
} from "../../../../utils";
// import RadioButtons from "../RadioButtons";
import useHealth from "../useHealth";

function DeploymentsList({ edge, project, edgeName, filterContext }) {
  const { status, statusOptions, updateStatus, filterByHealth } = useHealth();
  const {
    // applyResourceFilters,
    applyZtkResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;

  // const applyResourceFilters = data => {
  //   let rData = data;
  //   if (status === "healthy")
  //     rData = rData.filter(a => a.status.readyReplicas === a.status.replicas);
  //   if (status === "unhealthy")
  //     rData = rData.filter(a => a.status.readyReplicas !== a.status.replicas);
  //   return rData;
  // };
  const applyFilters = R.pipe(
    // applyResourceFilters,
    applyZtkResourceFilters,
    mapAgeToRow
  );

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      refreshInterval={refreshInterval}
      handleResolution={handleZtkResolution}
      // fetchArgs={[`info/deployment/?edgeId=${edgeId}&namespace=${namespace}`]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get deployment ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => (
        <DataGrid
          resetPageOnChange={status}
          showColumnSelector
          title={
            <Box display="flex" width="100%" mr={1}>
              <Typography variant="h6">Deployments</Typography>
              <div style={{ flex: 1 }} />
              {/* <RadioButtons
                value={status}
                options={statusOptions}
                onClick={updateStatus}
              /> */}
            </Box>
          }
          elevation={0}
          data={applyFilters(data)}
          loading={loading}
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
              dataKey: "deployment",
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
              label: "Images",
              dataKey: "images",
              cellStyle: {
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
            // {   ?????????????????????? CHECK
            //   label: "Condition",
            //   dataKey: "condition",
            //   defaultChecked: false,
            //   render({ rowData }) {
            //     const cellData = rowData.status.conditions?.map(c => c.type);
            //     return colorCodeJobs(cellData);
            //   }
            // },
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
              label: "Up to Date",
              align: "right",
              dataKey: "upToDateReplicas",
              defaultChecked: false,
              render: ({ rowData }) => rowData.status.updatedReplicas
            },
            {
              label: "Available",
              align: "right",
              dataKey: "availableReplicas",
              defaultChecked: false,
              render: ({ rowData }) => rowData.status.availableReplicas
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

export default DeploymentsList;
