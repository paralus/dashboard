import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import {
  renderLabels,
  getZtkKubeAge,
  useQuery,
  renderLink,
  longEm,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function CronJobsGrid({ edge, project, match, filterContext }) {
  const {
    applyResourceFilters,
    applyZtkResourceFilters,
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;

  const { query } = useQuery();
  const defaultSearchText = query.get("search") || "";
  const applyFilters = R.pipe(applyZtkResourceFilters, mapAgeToRow);

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      refreshInterval={refreshInterval}
      // fetchArgs={[
      //   `info/cronjob/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get cronjob ${
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
            title={<Typography variant="h6">Cron Jobs</Typography>}
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
                label: "Schedule",
                dataKey: "schedule",
                dataGetter: ({ rowData }) => rowData.spec.schedule
              },
              {
                label: "Suspend",
                dataKey: "suspend",
                dataGetter: ({ rowData }) => String(rowData.spec.suspend)
              },
              {
                label: "Jobs",
                dataKey: "jobs",
                render({ rowData }) {
                  const cellData = rowData.status?.active;
                  if (!Array.isArray(cellData)) return longEm();
                  return cellData.map((job, index) => (
                    <>
                      {renderLink(
                        job.name,
                        `${match.url}/resources/jobs?search=${job.name}`
                      )}
                      {index < cellData.length - 1 && ",  "}
                    </>
                  ));
                }
              },
              {
                label: "Images",
                dataKey: "images",
                defaultChecked: false,
                cellStyle: {
                  whiteSpace: "initial"
                },
                dataGetter({ rowData }) {
                  return (
                    rowData.spec?.jobTemplate?.spec?.template?.spec?.containers?.map(
                      c => c.image
                    ) || []
                  );
                },
                render({ cellData }) {
                  return renderLabels(cellData);
                }
              },
              {
                label: "Last Schedule",
                dataKey: "lastSchedule",
                render: ({ rowData }) =>
                  getZtkKubeAge(rowData.status?.lastScheduleTime)
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

export default CronJobsGrid;
