import React from "react";
import {
  Typography,
  Tooltip,
  IconButton,
  TableRow,
  TableCell
} from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import RefreshIcon from "@material-ui/icons/Refresh";
import EjectIcon from "@material-ui/icons/Eject";

import { getVMAge, useQuery } from "../../../../utils";
import Fetcher from "../../../../components/Fetcher";

function ManageVMsGrid({ edge, project, filterContext, eventSearch, actions }) {
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

  const edgeStatusColorClass = edge => {
    if (edge?.health === 1) {
      return "text-green";
    }
    return "text-red";
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
        `info/ztkquery/?edge=${edge?.name}&project=${project}&query=get vm ${
          namespace ? `-n ${namespace}` : "-A"
        } -o json`
      ]}
    >
      {({ data = [], loading = true }) => {
        if (!data.length) return null;
        const rowData = data[0];
        return (
          <TableRow>
            <TableCell>{rowData.metadata?.name}</TableCell>
            <TableCell>
              <span>
                <i
                  className={`zmdi zmdi-circle ${edgeStatusColorClass(edge)}`}
                  style={{ marginRight: "7px" }}
                />
                <span>{edge?.name}</span>
              </span>
            </TableCell>
            <TableCell>{rowData.metadata.namespace}</TableCell>
            <TableCell>
              {getVMAge(rowData.metadata.creationTimestamp)}
            </TableCell>
            <TableCell>{rowData?.status?.printableStatus || getVMStatus(rowData)}</TableCell>
            <TableCell>
              <>
                <Tooltip title="Start">
                  <IconButton
                    aria-label="Start"
                    onClick={_ => actions.start(rowData.metadata?.name)}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Pause">
                  <IconButton
                    aria-label="Pause"
                    onClick={_ => actions.pause(rowData.metadata?.name)}
                  >
                    <PauseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Unpause">
                  <IconButton
                    aria-label="Unpause"
                    onClick={_ => actions.unpause(rowData.metadata?.name)}
                  >
                    <EjectIcon className="rotate-90" fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Stop">
                  <IconButton
                    aria-label="Stop"
                    onClick={_ => actions.stop(rowData.metadata?.name)}
                  >
                    <StopIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Restart">
                  <IconButton
                    aria-label="Restart"
                    onClick={_ => actions.restart(rowData.metadata?.name)}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            </TableCell>
          </TableRow>
        );
      }}
    </Fetcher>
  );
}

export default ManageVMsGrid;
