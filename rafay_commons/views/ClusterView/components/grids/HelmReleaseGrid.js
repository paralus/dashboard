import React, { useContext } from "react";
import { Typography, Chip } from "@material-ui/core";
import Fetcher from "../../../../components/Fetcher";
import DataGrid from "../../../../components/DataGrid";
import { ResourceFiltersContext } from "../ResourceFilters";
import { readHelmChartStatus, dateFormatter } from "../../../../utils";

function HelmReleaseGrid({ edgeId, defaultSearchText }) {
  const {
    refreshInterval,
    selectedFilters: { namespace }
  } = useContext(ResourceFiltersContext);

  return (
    <Fetcher
      refreshInterval={refreshInterval}
      fetchArgs={[
        `resources/hemlcharts?edgeId=${edgeId}&namespace=${namespace}`
      ]}
    >
      {({ data = [], loading = true }) => {
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <DataGrid
              elevation={0}
              data={data}
              loading={loading}
              title={<Typography variant="h6">Helm Releases</Typography>}
              defaultPageSize={10}
              defaultOrderBy="chart"
              defaultSearchText={defaultSearchText}
              columns={[
                {
                  label: "Namespace",
                  dataKey: "namespace"
                },
                {
                  label: "Chart",
                  dataKey: "chart",
                  cellStyle: {
                    width: 500,
                    whiteSpace: "initial"
                  }
                },
                {
                  label: "Release",
                  dataKey: "release"
                },
                {
                  label: "Updated",
                  dataKey: "updated",
                  render({ rowData }) {
                    return dateFormatter(rowData?.updated);
                  }
                },
                {
                  label: "App Version",
                  dataKey: "appVersion"
                },
                {
                  label: "Status",
                  dataKey: "value",
                  render: readHelmChartStatus
                }
              ]}
            />
          </div>
        );
      }}
    </Fetcher>
  );
}

export default HelmReleaseGrid;
