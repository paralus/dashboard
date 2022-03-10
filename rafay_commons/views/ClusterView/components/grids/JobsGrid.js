import React from "react";
import * as R from "ramda";
import { Typography } from "@material-ui/core";
import {
  renderLabels,
  getZtkKubeAge,
  getDuration,
  renderLink,
  useQuery,
  longEm,
  colorCodeJobs,
  handleZtkResolution,
  mapAgeToRow
} from "../../../../utils";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function JobsGrid({ edge, project, match, filterContext }) {
  const {
    refreshInterval,
    applyZtkResourceFilters,
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
      //   `info/job/?edge=${edge}&project=${project}&namespace=${namespace}`
      // ]}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get jobs ${
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
            title={<Typography variant="h6">Jobs</Typography>}
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
                label: "Conditions",
                dataKey: "conditions",
                cellStyle: {
                  whiteSpace: "initial"
                },
                render({ rowData }) {
                  const cellData = rowData.status?.conditions?.map(c => c.type);
                  if (cellData) {
                    return colorCodeJobs(cellData);
                  }
                  return longEm();
                }
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
                label: "Completions",
                dataKey: "completion",
                dataGetter({ rowData }) {
                  const completion = rowData.spec.completions;
                  const succeeded = rowData.status.succeeded;
                  return `${completion}/${succeeded}`;
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
                    rowData.spec.template?.spec?.containers?.map(
                      c => c.image
                    ) || []
                  );
                },
                render({ cellData }) {
                  return renderLabels(cellData);
                }
              },
              {
                label: "Owner",
                dataKey: "ownerReferences",
                dataGetter({ rowData }) {
                  const ownerReferences =
                    rowData.metadata?.ownerReferences || [];
                  return ownerReferences.map(({ kind, name }) => ({
                    kind,
                    name
                  }));
                },
                render({ cellData }) {
                  if (!Array.isArray(cellData)) return longEm();
                  return cellData.map(r => (
                    <>
                      {r.kind} :{" "}
                      {renderLink(
                        r.name,
                        `${match.url}/resources/cronjobs?search=${r.name}`
                      )}
                    </>
                  ));
                }
              },
              {
                label: "Age",
                dataKey: "createdAt",
                render({ rowData }) {
                  return getZtkKubeAge(rowData.metadata.creationTimestamp);
                }
              },
              {
                label: "Duration",
                dataKey: "duration",
                render({ rowData }) {
                  const { completionTime, startTime } = rowData.status;
                  return getDuration(completionTime, startTime);
                }
              }
            ]}
          />
        );
      }}
    </Fetcher>
  );
}

export default JobsGrid;
