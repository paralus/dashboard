import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import {
  getZtkKubeAge,
  useQuery,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import { ResourceFiltersContext } from "../ResourceFilters";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function RolesGrid({ edge, project, ctype, filterContext }) {
  const {
    applyZtkResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;
  const { query } = useQuery();
  const defaultSearchText = query.get("search") || "";
  const scope = ctype ? "cluster" : "namespace";
  const title = ctype ? "Cluster Roles" : "Roles";
  const resourceName = scope === "cluster" ? "clusterrole" : "role";

  const applyFilters = R.pipe(applyZtkResourceFilters, mapAgeToRow);

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      refreshInterval={refreshInterval}
      // fetchArgs={[
      //   `info/role/?edge=${edge}&project=${project}&namespace=${namespace}&scope=${scope}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get ${resourceName} ${
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
            title={<Typography variant="h6">{title}</Typography>}
            data={applyFilters(data)}
            defaultSearchText={defaultSearchText}
            columns={
              ctype
                ? [
                    {
                      label: "Name",
                      dataKey: "name",
                      dataGetter: ({ rowData }) => rowData.metadata.name
                    },
                    {
                      label: "Age",
                      dataKey: "createdAt",
                      render: ({ rowData }) =>
                        getZtkKubeAge(rowData.metadata.creationTimestamp)
                    }
                  ]
                : [
                    {
                      label: "Name",
                      dataKey: "name",
                      dataGetter: ({ rowData }) => rowData.metadata.name
                    },
                    {
                      label: "Namespace",
                      dataKey: "namespace",
                      dataGetter: ({ rowData }) => rowData.metadata.namespace
                    },
                    {
                      label: "Age",
                      dataKey: "createdAt",
                      render: ({ rowData }) => getZtkKubeAge(rowData.createdAt)
                    }
                  ]
            }
          />
        );
      }}
    </Fetcher>
  );
}

export default RolesGrid;
