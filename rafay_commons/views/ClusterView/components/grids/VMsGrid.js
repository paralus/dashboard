import React from "react";
import { Typography, Tooltip, IconButton } from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import RefreshIcon from "@material-ui/icons/Refresh";
import EjectIcon from "@material-ui/icons/Eject";

import { getVMAge, useQuery } from "../../../../utils";
import DataGrid from "../../../../components/DataGrid";
import Fetcher from "../../../../components/Fetcher";

function VMsGrid({ edge, project, filterContext, eventSearch, actions }) {
  const {
    refreshInterval,
    manualRefresh,
    selectedWorkload,
    selectedFilters: { namespace },
    viewBy
  } = filterContext;
  const { query } = useQuery();
  const defaultSearchText = query.get("search") || eventSearch || "";

  const getVMStatus = data => {
    if (!data.spec.running) return "Stopped";
    if (data.status?.conditions?.find(a => a.type === "Paused"))
      return "Paused";
    if (data.status?.created && !data.status?.ready) return "Restarting";
    return "Ready";
  };

  return (
    <Fetcher
      manualRefresh={manualRefresh}
      refreshInterval={refreshInterval}
      handleResolution={data => {
        let filteredData = data?.body?.items;
        if (selectedWorkload && viewBy === "workload") {
          filteredData = filteredData?.filter(
            v => v.metadata.labels["rep-workload"] === selectedWorkload
          );
        }
        return filteredData || [];
      }}
      fetchArgs={[
        `info/ztkquery/?edge=${edge}&project=${project}&query=get vm ${
          namespace ? `-n ${namespace}` : "-A"
        } -o json`
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
            title={<Typography variant="h6">Virtual Machines</Typography>}
            // data={applyResourceFilters(data)}
            data={data}
            defaultSearchText={defaultSearchText}
            columns={[
              {
                label: "Namespace",
                dataKey: "namespace",
                dataGetter: ({ rowData }) => {
                  return rowData.metadata.namespace;
                }
              },
              {
                label: "Name",
                dataKey: "name",
                dataGetter: ({ rowData }) => {
                  return rowData.metadata?.name;
                }
              },
              {
                label: "Age",
                dataKey: "createdAt",
                render: ({ rowData }) =>
                  getVMAge(rowData.metadata.creationTimestamp)
              },
              {
                label: "Status",
                dataKey: "status",
                render: ({ rowData }) => rowData?.status?.printableStatus || getVMStatus(rowData)
              },

              {
                label: "Actions",
                dataKey: "actions",
                cellStyle: {
                  position: "sticky",
                  right: 0,
                  background: "#f7f7f7"
                },
                render({ rowData }) {
                  return (
                    <>
                      <Tooltip title="Start">
                        <IconButton
                          aria-label="Start"
                          onClick={_ =>
                            actions.start(
                              rowData.metadata?.name,
                              rowData.metadata.namespace
                            )
                          }
                        >
                          <PlayArrowIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Pause">
                        <IconButton
                          aria-label="Pause"
                          onClick={_ =>
                            actions.pause(
                              rowData.metadata?.name,
                              rowData.metadata.namespace
                            )
                          }
                        >
                          <PauseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Unpause">
                        <IconButton
                          aria-label="Unpause"
                          onClick={_ =>
                            actions.unpause(
                              rowData.metadata?.name,
                              rowData.metadata.namespace
                            )
                          }
                        >
                          <EjectIcon className="rotate-90" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Stop">
                        <IconButton
                          aria-label="Stop"
                          onClick={_ =>
                            actions.stop(
                              rowData.metadata?.name,
                              rowData.metadata.namespace
                            )
                          }
                        >
                          <StopIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Restart">
                        <IconButton
                          aria-label="Restart"
                          onClick={_ =>
                            actions.restart(
                              rowData.metadata?.name,
                              rowData.metadata.namespace
                            )
                          }
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  );
                }
              }
            ]}
          />
        );
      }}
    </Fetcher>
  );
}

export default VMsGrid;
