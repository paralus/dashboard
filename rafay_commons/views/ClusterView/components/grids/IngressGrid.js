import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";
import {
  getZtkKubeAge,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";

function IngressGrid(props) {
  const { edge, project, filterContext } = props;
  const {
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
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get ingress ${
          !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => (
        <DataGrid
          loading={loading}
          elevation={0}
          defaultOrder="asc"
          defaultOrderBy="namespace"
          showColumnSelector
          title={<Typography variant="h6">Ingress List</Typography>}
          data={applyFilters(data)}
          columns={[
            {
              label: "Namespace",
              dataKey: "namespace",
              render: ({ rowData }) => (
                <span style={{ whiteSpace: "nowrap" }}>
                  {rowData.metadata.namespace}
                </span>
              )
            },
            {
              label: "Name",
              dataKey: "ingress",
              render: ({ rowData }) => (
                <span style={{ whiteSpace: "nowrap" }}>
                  {rowData.metadata.name}
                </span>
              )
            },
            {
              label: "Host",
              dataKey: "host",
              render: ({ rowData }) => (
                <div style={{ whiteSpace: "nowrap" }}>
                  {rowData.spec.rules?.map(r => <div>{r.host}</div>) || "-"}
                </div>
              )
            },
            {
              label: "PORTS",
              align: "right",
              dataKey: "service_port",
              render: ({ rowData }) => (
                <div style={{ whiteSpace: "nowrap" }}>
                  <div style={{ whiteSpace: "nowrap" }}>
                    {rowData.spec.rules?.map(r => (
                      <div>
                        {r.http.paths
                          .map(
                            p =>
                              p.backend?.servicePort ||
                              p.backend?.service?.port?.number ||
                              "-"
                          )
                          .join(", ")}
                      </div>
                    )) || "-"}
                  </div>
                </div>
              )
            },
            {
              label: "Age",
              dataKey: "createdAt",
              render: ({ rowData }) =>
                getZtkKubeAge(rowData.metadata.creationTimestamp)
            }
          ]}
        />
      )}
    </Fetcher>
  );
}

export default IngressGrid;
