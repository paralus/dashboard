import React from "react";
import { Typography } from "@material-ui/core";
import {
  handleZtkResolution,
  getZtkKubeAge,
  useQuery,
  longEm
} from "../../../../utils";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function EventsGrid({ edge, project, ctype, filterContext, eventSearch }) {
  const {
    refreshInterval,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;
  const { query } = useQuery();
  const defaultSearchText = query.get("search") || eventSearch || "";

  let namespaceFilter = "-A";
  if (namespace) namespaceFilter = `-n ${namespace}`;
  if (namespace === "All" || ctype === "events") namespaceFilter = "-A";

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      handleResolution={handleZtkResolution}
      refreshInterval={refreshInterval}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get events ${namespaceFilter} -o json`
      ]}
    >
      {({ data = [], loading = true }) => {
        return (
          <DataGrid
            elevation={0}
            loading={loading}
            defaultOrder="desc"
            defaultOrderBy="createdAt"
            showColumnSelector
            title={<Typography variant="h6">Events</Typography>}
            data={data?.map(d => {
              return { ...d, createdAt: d.lastTimestamp || d.eventTime };
            })}
            defaultSearchText={defaultSearchText}
            columns={[
              {
                label: "Age",
                dataKey: "createdAt",
                render({ rowData }) {
                  return getZtkKubeAge(
                    rowData.lastTimestamp || rowData.eventTime
                  );
                }
              },
              {
                label: "Message",
                dataKey: "message",
                cellStyle: {
                  whiteSpace: "initial"
                }
              },
              {
                label: "Namespace",
                dataKey: "namespace",
                dataGetter: ({ rowData }) => {
                  // return ctype ? "" : rowData.metadata.namespace;
                  return rowData.metadata.namespace;
                }
              },

              {
                label: "Reason",
                dataKey: "reason"
              },

              {
                label: "Type",
                dataKey: "object",
                dataGetter: ({ rowData }) => {
                  return rowData.involvedObject?.kind;
                }
              },

              {
                label: "Involved Object",
                dataKey: "objectName",
                dataGetter: ({ rowData }) => {
                  return rowData.involvedObject?.name;
                }
              },

              {
                label: "Source",
                dataKey: "source",
                dataGetter: ({ rowData }) => {
                  let source = rowData.source?.component;
                  if (rowData.source?.host) {
                    source = `${rowData.source.component}, ${rowData.source.host}`;
                  }
                  if (!source) {
                    source = `${rowData.reportingComponent}, ${rowData.reportingInstance}`;
                  }
                  return source;
                }
              },
              {
                label: "Count",
                dataKey: "count",
                dataGetter: ({ rowData }) => {
                  return rowData.count || 1;
                }
              }
            ]}
          />
        );
      }}
    </Fetcher>
  );
}

export default EventsGrid;
