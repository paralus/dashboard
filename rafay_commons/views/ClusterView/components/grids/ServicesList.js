import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import {
  renderLabels,
  getZtkKubeAge,
  longEm,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

const isExternalPort = p => {
  return p.protocol !== "NodePort" && p.protocol !== "LoadBalancer";
};

function ServicesList({ edge, project, defaultSearchText, filterContext }) {
  const {
    // applyResourceFilters,
    applyZtkResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;
  const applyFilters = R.pipe(applyZtkResourceFilters, mapAgeToRow);

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      refreshInterval={refreshInterval}
      // fetchArgs={[
      //   `info/service/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get services ${
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
            title={<Typography variant="h6">Services</Typography>}
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
                dataKey: "type",
                dataGetter: ({ rowData }) => rowData.spec.type
              },
              {
                label: "Cluster IP",
                dataKey: "clusterIP",
                dataGetter: ({ rowData }) => rowData.spec.clusterIP
              },
              {
                label: "Internal Endpoints",
                dataKey: "internalEndpoints",
                dataGetter({ rowData }) {
                  const { name, namespace } = rowData.metadata;
                  const ns = namespace === "default" ? "" : `.${namespace}`;
                  return rowData.spec.ports
                    .filter(isExternalPort)
                    .map(({ port, protocol }) => {
                      return `${name}${ns}:${port} ${protocol}`;
                    });
                },
                render({ cellData }) {
                  if (Array.isArray(cellData))
                    return cellData.map(c => <div>{c}</div>);
                  return cellData;
                }
              },
              {
                label: "External Endpoints",
                dataKey: "externalName",
                render({ rowData }) {
                  return rowData.spec.externalIPs?.join(", ") || longEm();
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

export default ServicesList;
