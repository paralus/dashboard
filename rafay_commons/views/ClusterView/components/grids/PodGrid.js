import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Typography,
  Box,
  Link,
  Popover,
  Paper
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { deletePodZtk } from "actions/ClusterUtil";
import { useSnack } from "rafay_commons/utils/useSnack";

import Fetcher from "rafay_commons/components/Fetcher";
import DataGrid from "rafay_commons/components/DataGrid";
import {
  getZtkKubeAge,
  handleZtkResolution,
  colorCodePhases,
  renderLabels,
  useQuery
} from "rafay_commons/utils";
import RadioButtons from "../RadioButtons";
import useHealth from "../useHealth";
import EventsGrid from "./EventsGrid";
import Spinner from "../../../../components/Spinner";
import RafayDrawer from "../../../../components/RafayDrawer";
import ShellAndLogs from "../ShellAndLogs";
import PodActions from "../PodActions";

const useStyles = makeStyles(theme => ({
  grow: {
    flex: 1
  },
  containerText: {
    color: "rgba(0, 0, 0, 0.8)"
  },
  imageText: {
    color: "rgba(0, 0, 0, 0.54)",
    marginLeft: "2px"
  }
}));

// const filterOutDeletedPod = pod => R.reject(R.propEq("pod", pod));

function GridWithFilters({
  data = [],
  loading = true,
  match,
  history,
  filterContext,
  openEventDrawer,
  openLogsModal,
  openDescribeDrawer,
  userRoles,
  edge,
  isWorkloadDebug
}) {
  const classes = useStyles();
  const { query } = useQuery();
  const { showSnack } = useSnack();
  const defaultSearchText = query.get("search") || "";
  const { status, statusOptions, updateStatus, filterByHealth } = useHealth();
  const [deletedPod, setDeletedPod] = useState(null);
  const [deleteActionLoading, setDeleteActionLoading] = useState(false);
  // const { applyResourceFilters } = filterContext;
  // const applyFilters = R.pipe(
  //   applyResourceFilters,
  //   filterByHealth,
  //   filterOutDeletedPod(deletedPod)
  // );

  const applyFilters = data => {
    let rData = data;
    if (status === "healthy")
      rData = data.filter(a => a.status.phase === "Running");
    if (status === "unhealthy")
      rData = data.filter(a => a.status.phase !== "Running");
    if (deletedPod) rData = rData.filter(a => a.metadata.name !== deletedPod);
    return rData;
  };

  useEffect(() => {
    // To hide the deleted pod untill its deleted from influx db
    if (data && deletedPod) {
      const deletedPodExist = R.filter(R.propEq("pod", deletedPod))(data)
        .length;
      if (!deletedPodExist) setDeletedPod(null);
    }
  }, [data, deletedPod]);

  const deletePod = pod => {
    setDeleteActionLoading(true);
    deletePodZtk(pod.pod, edge.name, edge.project_id, pod.namespace)
      .then(res => res.json())
      .then(({ statusCode, body }) => {
        setDeletedPod(pod.pod);
        setDeleteActionLoading(false);
        const msg = statusCode === 500 ? body.split(":")[2] ?? body : body;
        const severity = statusCode === 500 ? "error" : "success";
        showSnack(msg, severity);
      })
      .catch(error => {
        setDeleteActionLoading(false);
        showSnack("some error occured, please try again later");
        console.log(error);
      });
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <DataGrid
        resetPageOnChange={status}
        showColumnSelector
        elevation={0}
        data={applyFilters(data)}
        // data={data}
        loading={loading || deleteActionLoading}
        defaultPageSize={10}
        defaultSearchText={defaultSearchText}
        defaultOrder="asc"
        defaultOrderBy="namespace"
        title={
          <Box display="flex" width="100%" mr={1}>
            <Typography variant="h6">Pods</Typography>
            <div className={classes.grow} />
            <RadioButtons
              value={status}
              options={statusOptions}
              onClick={updateStatus}
            />
          </Box>
        }
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
            dataKey: "pod",
            render({ rowData }) {
              const { name, namespace } = rowData.metadata;
              const containers = rowData.spec.containers;
              return (
                <React.Fragment>
                  {isWorkloadDebug ? (
                    <span>{name}</span>
                  ) : (
                    <Link
                      component={RouterLink}
                      to={`${match.url}/pods/${name}?namespace=${namespace}`}
                    >
                      {name}
                    </Link>
                  )}
                  {containers.map(container => (
                    <Typography
                      key={container.name}
                      variant="caption"
                      display="block"
                      className={classes.containerText}
                    >
                      {container.name}
                      <Typography
                        variant="caption"
                        display="inline"
                        className={classes.imageText}
                      >
                        {container.image}
                      </Typography>
                    </Typography>
                  ))}
                </React.Fragment>
              );
            }
          },
          {
            label: "Ready",
            dataKey: "ready",
            dataGetter({ rowData }) {
              // const { containerReasons = {}, containers = {} } = rowData;
              const containerCount = rowData.spec.containers?.length;
              const readyCount =
                rowData.status.containerStatuses?.filter(c => c.ready)
                  ?.length || 0;
              return `${readyCount}/${containerCount}`;
              // const containerCount = R.keys(containers).length;
              // const badContainerCount = R.pipe(
              //   R.values,
              //   R.reject(x => x !== "Completed"),
              //   R.length
              // )(containerReasons);
              // return `${containerCount - badContainerCount}/${containerCount}`;
            }
          },
          {
            label: "Status",
            dataKey: "phase",
            render({ rowData }) {
              return colorCodePhases([rowData.status.phase]);
              // const { containerReasons, phase } = rowData;
              // const phases = containerReasons
              //   ? R.values(containerReasons)
              //   : [phase];
              // return colorCodePhases(phases);
            }
          },
          {
            label: "QoS",
            dataKey: "qos",
            render({ rowData }) {
              return rowData.status.qosClass;
            }
          },
          {
            label: "Restarts",
            align: "right",
            dataKey: "restarts",
            render({ rowData }) {
              return rowData.status.containerStatuses?.[0].restartCount; // multiple containers ???
            }
          },
          {
            label: "Age",
            dataKey: "createdAt",
            render({ rowData }) {
              return getZtkKubeAge(rowData.status.startTime);
            }
          },
          {
            label: "Labels",
            dataKey: "labels",
            defaultChecked: false,
            cellStyle: {
              whiteSpace: "initial",
              maxWidth: 300
            },
            render({ rowData }) {
              const { labels } = rowData.metadata;
              const cellData = Object.keys(labels).map(
                k => `${k}:${labels[k]}`
              );
              return renderLabels(cellData);
            }
          },

          {
            label: "Pod IP",
            dataKey: "pod_ip",
            render({ rowData }) {
              return rowData.status.podIP;
            }
          },
          {
            label: "Host IP",
            dataKey: "host_ip",
            defaultChecked: false,
            render({ rowData }) {
              return rowData.status.hostIP;
            }
          },
          {
            label: "Node",
            dataKey: "node",
            defaultChecked: false,
            render({ rowData }) {
              return rowData.spec.nodeName;
            }
          },
          {
            label: "CPU (Request)",
            align: "right",
            dataKey: "cpuRequest",
            defaultChecked: false,
            // dataGetter({ rowData }) {
            //   return rowData.cpuRequest || -1;
            // },
            // render({ cellData }) {
            //   return cellData >= 0 ? formatter(cellData, "0.00a") : longEm();
            // }
            render({ rowData }) {
              return (
                rowData.spec.containers
                  ?.map(c => c.resources?.requests?.cpu)
                  .filter(c => c)
                  .join(",") || "—"
              );
            }
          },
          {
            label: "CPU (Limit)",
            align: "right",
            dataKey: "cpuLimit",
            defaultChecked: false,
            // dataGetter({ rowData }) {
            //   return rowData.cpuLimit || -1;
            // },
            // render({ cellData }) {
            //   return cellData >= 0 ? formatter(cellData, "0.00a") : longEm();
            // }
            render({ rowData }) {
              return (
                rowData.spec.containers
                  ?.map(c => c.resources?.limits?.cpu)
                  .filter(c => c)
                  .join(",") || "—"
              );
            }
          },
          // {
          //   label: "CPU Usage (% of Request)",
          //   align: "right",
          //   dataKey: "cpuUsage",
          //   defaultChecked: false,
          //   dataGetter({ rowData }) {
          //     return isSomething(rowData.cpuUsage) ? rowData.cpuUsage : -1;
          //   },
          //   render({ rowData }) {
          //     const { cpuUsage, cpuRequest } = rowData;

          //     if (cpuUsage === -1) return longEm();
          //     if (cpuUsage === 0 || cpuRequest === 0) return "0 (0%)";
          //     if (cpuRequest >= 0 && cpuUsage) {
          //       const pValue = cpuUsage / cpuRequest;
          //       const percent = formatter(pValue, "0.0%");
          //       return `${formatter(cpuUsage, "0.00a")} (${percent})`;
          //     }
          //     if (cpuUsage) {
          //       return formatter(cpuUsage, "0.00a");
          //     }
          //     return longEm();
          //   }
          // },
          {
            label: "Memory (Request)",
            align: "right",
            dataKey: "memoryRequest",
            defaultChecked: false,
            // dataGetter({ rowData }) {
            //   return rowData.memoryRequest || -1;
            // },
            // render({ cellData }) {
            //   return cellData >= 0 ? formatter(cellData, "0.0 B") : longEm();
            // }
            render({ rowData }) {
              return (
                rowData.spec.containers
                  ?.map(c => c.resources?.requests?.memory)
                  .filter(c => c)
                  .join(",") || "—"
              );
            }
          },
          {
            label: "Memory (Limit)",
            align: "right",
            dataKey: "memoryLimit",
            defaultChecked: false,
            // dataGetter({ rowData }) {
            //   return rowData.memoryLimit || -1;
            // },
            // render({ cellData }) {
            //   return cellData >= 0 ? formatter(cellData, "0.0 B") : longEm();
            // }
            render({ rowData }) {
              return (
                rowData.spec.containers
                  ?.map(c => c.resources?.limits?.memory)
                  .filter(c => c)
                  .join(",") || "—"
              );
            }
          },
          // {
          //   label: "Memory Usage (% of Request)",
          //   align: "right",
          //   dataKey: "memoryUsage",
          //   defaultChecked: false,
          //   dataGetter({ rowData }) {
          //     return isSomething(rowData.memoryUsage)
          //       ? rowData.memoryUsage
          //       : -1;
          //   },
          //   render({ rowData }) {
          //     const { memoryUsage, memoryRequest } = rowData;

          //     if (memoryUsage === -1) return longEm();
          //     if (memoryUsage === 0 || memoryRequest === 0) return "0 (0%)";
          //     if (memoryRequest >= 0 && memoryUsage) {
          //       const pValue = memoryUsage / memoryRequest;
          //       const percent = formatter(pValue, "0.0%");
          //       return `${formatter(memoryUsage, "0.0 B")} (${percent})`;
          //     }
          //     if (memoryUsage) {
          //       return formatter(memoryUsage, "0.0 B");
          //     }
          //     return longEm();
          //   }
          // },
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
                <PodActions
                  openLogsModal={openLogsModal}
                  deletePod={deletePod}
                  eventClick={openEventDrawer}
                  pod={{
                    pod: rowData.metadata.name,
                    namespace: rowData.metadata.namespace,
                    phase: rowData.status.phase,
                    containers: rowData.spec.containers
                  }}
                  history={history}
                  match={match}
                  openDescribeDrawer={openDescribeDrawer}
                  userRoles={userRoles}
                />
              );
            }
          }
        ]}
      />
    </div>
  );
}

function PodGrid({ edgeId, edge, filterContext, ...rest }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");
  const [resourceForDescribe, setResourceForDescribe] = useState(null);
  const [eventSearch, setEventSearch] = useState("");
  const [openLogsModalForPod, setopenLogsModalForPod] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    refreshInterval,
    applyZtkResourceFilters,
    manualRefresh,
    selectedFilters: { namespace }
  } = filterContext;

  const { userRoles } = useSelector(s => s.UserSession);
  const openEventDrawer = searchEvent => {
    setDrawerContent("event");
    setEventSearch(searchEvent);
    setOpenDrawer(true);
  };
  const openDescribeDrawer = pod => {
    setDrawerContent("describe");
    setResourceForDescribe(pod);
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    if (drawerContent === "event") {
      setEventSearch("");
    } else if (drawerContent === "describe") {
      setResourceForDescribe(null);
    }

    setOpenDrawer(false);
  };
  const handleModalOpen = e => pod => {
    setAnchorEl(e.currentTarget);
    setopenLogsModalForPod(pod);
  };
  const modalHandleClose = () => {
    setopenLogsModalForPod(null);
    setAnchorEl(null);
  };

  const isEventDrawer = drawerContent === "event";

  return (
    <>
      <Fetcher
        manualRefresh={manualRefresh}
        refreshInterval={refreshInterval}
        handleResolution={handleZtkResolution}
        // fetchArgs={[`info/pod/?edgeId=${edgeId}&namespace=${namespace}`]}
        fetchArgs={[
          `info/ztkquery/?edge=${edge.name}&project=${
            edge.project_id
          }&query=get pods ${
            !namespace || namespace === "All" ? "-A" : `-n ${namespace}`
          } -o json`
        ]}
      >
        {fetcher => (
          <GridWithFilters
            {...fetcher}
            {...rest}
            data={applyZtkResourceFilters(fetcher.data)}
            filterContext={filterContext}
            openEventDrawer={openEventDrawer}
            openLogsModal={handleModalOpen}
            openDescribeDrawer={openDescribeDrawer}
            userRoles={userRoles}
            edge={edge}
          />
        )}
      </Fetcher>

      <RafayDrawer
        anchor="right"
        open={openDrawer}
        onClose={closeDrawer}
        headerText={isEventDrawer ? "Events" : "Describe"}
        subHeaderText={isEventDrawer ? "" : resourceForDescribe?.name}
      >
        {isEventDrawer ? (
          <div style={{ padding: "22px 48px", width: "75vw" }}>
            <EventsGrid
              eventSearch={eventSearch}
              edge={edge?.name}
              project={edge?.project_id}
              filterContext={filterContext}
            />
          </div>
        ) : (
          <Fetcher
            fetchArgs={[
              `/info/describe/pods?edge=${edge?.name}&project=${edge?.project_id}&namespace=${resourceForDescribe?.namespace}&resourceName=${resourceForDescribe?.name}`
            ]}
          >
            {({ data = [], loading = true }) => (
              <>
                <div style={{ padding: 24, background: "#f8f9fa" }}>
                  <Paper style={{ minHeight: "100vh" }}>
                    <Spinner loading={loading}>
                      <div style={{ padding: "22px 48px", width: "75vw" }}>
                        <pre>{data}</pre>
                      </div>
                    </Spinner>
                  </Paper>
                </div>
              </>
            )}
          </Fetcher>
        )}
      </RafayDrawer>

      <Popover
        id="pod-containers-popover"
        open={openLogsModalForPod !== null}
        anchorEl={anchorEl}
        onClose={modalHandleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right"
        }}
      >
        <ShellAndLogs
          modalHandleClose={modalHandleClose}
          {...openLogsModalForPod}
          edge={edge}
          userRoles={userRoles}
        />
      </Popover>
    </>
  );
}

export default PodGrid;
