import React from "react";
import { useDispatch } from "react-redux";
import {
  openKubectlDrawer,
  closeKubectlDrawer,
  getContainerLogs,
} from "actions/index";
import { makeStyles, Tooltip, IconButton } from "@material-ui/core";
import { or, propEq } from "ramda";
import LogsIcon from "@material-ui/icons/FeaturedPlayList";
import ShellIcon from "@material-ui/icons/WebAsset";
import DownloadIcon from "@material-ui/icons/GetApp";
import CircularProgress from "@material-ui/core/CircularProgress";
import useToggle from "../../../utils/useToggle";
import { downloadFile } from "../../../utils/helpers";

const useContainerLogsStyle = makeStyles((theme) => ({
  root: { padding: 16, width: "32vw" },
  header: { color: "teal", fontSize: 16, marginBottom: 9 },
  row: {
    padding: 8,
    display: "grid",
    gridTemplateColumns: "55% 45%",
    borderTop: "1px solid #e9ecef",
    borderBottom: "1px solid #e9ecef",
    overflow: "auto",
    alignItems: "center",
  },
  actionButton: {
    textTransform: "none",
    float: "right",
    padding: "3px 16px",
  },
  actionButtonDisabled: {
    cursor: "not-allowed",
  },
}));

export default function ShellAndLogs({
  pod,
  namespace,
  containers,
  edge,
  modalHandleClose,
  userRoles,
}) {
  const classes = useContainerLogsStyle();
  const dispatch = useDispatch();
  const [isLogsLoading, setLogsLoading] = useToggle(false);
  if (!containers) return "";

  const readOnlyRole = or(
    propEq("namespaceReadOnly", true),
    propEq("projectReadOnly", true),
  )(userRoles);

  const handleKubectlOpen = (namespace, cmd, isLogsOnly) => {
    if (!edge || !namespace) return;
    dispatch(closeKubectlDrawer());
    setTimeout(
      () =>
        dispatch(
          openKubectlDrawer(
            edge?.metadata.project,
            edge?.metadata.name,
            namespace,
            btoa(cmd),
            "namespace",
            edge?.metadata.id,
            isLogsOnly,
          ),
        ),
      500,
    );
  };

  const execClick = (container) => {
    if (readOnlyRole) return;
    const cmd = `exec -it -n ${namespace} ${pod} -c ${container} -- /bin/sh`;
    handleKubectlOpen(namespace, cmd);
    modalHandleClose();
  };

  const logsClick = (container) => {
    const cmd = `logs -n ${namespace} ${pod} ${container}`;
    handleKubectlOpen(namespace, cmd, true);
    modalHandleClose();
  };

  const downloadLogs = (container) => {
    setLogsLoading.on();
    getContainerLogs(pod, container, edge.name, edge.project_id, namespace)
      .then((res) => res.json())
      .then(({ body }) => {
        downloadFile(`logs-${pod}-${container}.txt`, body);
        setLogsLoading.off();
        modalHandleClose();
      })
      .catch((error) => {
        setLogsLoading.off();
      });
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <span>Containers</span>
      </div>
      {Object.keys(containers).map((container, index) => (
        <div className={classes.row} key={`container-row${index}`}>
          <div>
            <span style={{ display: "inline-block", paddingTop: 9 }}>
              {container}
            </span>
          </div>
          <div className="d-flex justify-content-end">
            <Tooltip placement="top" title="Logs">
              <span>
                <IconButton
                  aria-label="logs"
                  onClick={() => logsClick(container)}
                  classes={{
                    disabled: classes.actionButtonDisabled,
                  }}
                >
                  <LogsIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip placement="top" title="Exec">
              <span>
                <IconButton
                  aria-label="Exec"
                  disabled={readOnlyRole}
                  onClick={() => execClick(container)}
                  classes={{
                    disabled: classes.actionButtonDisabled,
                  }}
                >
                  <ShellIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip placement="top" title="Download Logs (last 200 lines)">
              <span>
                <IconButton
                  aria-label="Download Logs"
                  onClick={() => downloadLogs(container)}
                  classes={{
                    disabled: classes.actionButtonDisabled,
                  }}
                >
                  {isLogsLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <DownloadIcon fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
