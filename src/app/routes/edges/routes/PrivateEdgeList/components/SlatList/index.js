import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import LabelItem from "../../../../../../..//views/ClusterView/components/LabelTaintItem";
import { ClusterActionsContext } from "../../../../../../..//views/ClusterView/ClusterViewContexts";

import ClusterType from "components/ClusterType";
import ClusterActions from "components/ClusterActions/index";
import ClusterWidgets from "./components/ClusterWidgets";
import ClusterStatusInfo from "./components/ClusterStatusInfo";
import CountCard from "./components/CountCard";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
  baseFont: {
    fontSize: "12px",
  },
}));

const bpSyncColourOptions = {
  Success: "teal",
  NotSet: "gray",
  InProgress: "blue",
  Pending: "gray",
  Failed: "red",
};

const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

const SlatList = (props) => {
  const [openClusterSharing, setOpenClusterSharing] = useState(false);
  const { disableActions } = props;
  const { UserSession, Projects, sshEdges, partnerDetail, alertsConfig } =
    props.parentProps;

  const parseSlatBackground = (index) => {
    if (index % 2 === 1) {
      return {
        backgroundColor: "#f0f8ff78",
      };
    }
    return {};
  };

  const goToConsole = (_) => {
    const { handleOpenKubectl } = props;
    handleOpenKubectl();
  };

  const currentProjectId = props.parentProps.currentProject.id;
  const { cluster } = props;
  const labelObject = cluster?.cluster?.metadata?.labels || {};
  const customLabels = Object.keys(labelObject)
    .filter((x) => !x.includes(".dev/"))
    .map((x) => ({ key: x, value: labelObject[x] }));

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const openProvisionScreen = () => {
    const { history, cluster } = props;
    if (cluster.cluster_type === "imported") {
      history.push(`/app/clusters/provision/${cluster.metadata.id}/imported`);
    }
  };

  const handleViewClick = (action = undefined) => {
    const { history, cluster } = props;
    const edgePath = `${history.location.pathname}/${cluster.metadata.name}`;
    history.push(`${edgePath}`);
  };

  const isClusterReady = () => {
    let ready = false;
    if (
      cluster?.spec.clusterData &&
      cluster?.spec.clusterData.cluster_status &&
      cluster?.spec.clusterData.cluster_status.conditions &&
      cluster?.spec.clusterData.cluster_status.conditions.length > 0
    ) {
      for (
        let index = 0;
        index < cluster?.spec.clusterData?.cluster_status?.conditions?.length;
        index++
      ) {
        ready =
          cluster.spec.clusterData.cluster_status.conditions[index].type ===
            "ClusterReady" &&
          cluster.spec.clusterData.cluster_status.conditions[index].status ===
            3;
        if (ready) {
          return ready;
        }
      }
    }
    return ready;
  };

  return (
    <div>
      <Paper
        key={props.index}
        style={parseSlatBackground(props.index)}
        className="p-3 mb-3"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="mr-4">
            <h2 className="m-0">
              <span style={{ color: "teal", cursor: "pointer" }}>
                {cluster.metadata.name}

                <br />
                {props.state.userRole === "SUPER_ADMIN" && (
                  <span style={{ color: "#808080c7", fontSize: "smaller" }}>
                    {cluster.metadata.id}
                    <br />
                    {cluster.metadata.display_name}
                  </span>
                )}
              </span>
            </h2>
          </div>

          {isClusterReady && (
            <ClusterWidgets
              edgeId={cluster.metadata.id}
              onKubectlClick={props.handleOpenKubectl}
              cluster={cluster}
            />
          )}
          <div className="">
            {props.state.userRole !== "READ_ONLY_OPS" && !disableActions && (
              <ClusterActionsContext.Provider
                value={{
                  UserSession,
                  project: props.parentProps.currentProject,
                  sshEdges,
                  partnerDetail,
                  alertsConfig,
                }}
              >
                <ClusterActions
                  edge={cluster}
                  userRole={props.state.userRole}
                  pauseAutoRefresh={props.pauseAutoRefresh}
                  resumeAutoRefresh={props.resumeAutoRefresh}
                />
              </ClusterActionsContext.Provider>
            )}
          </div>
        </div>
        <hr style={{ marginLeft: "-16px", marginRight: "-16px" }} />
        <div className="row">
          <div className="col-md-3">
            <div className="row">
              <div className="col-md-12">
                <span className="d-inline-flex flex-row align-items-center">
                  <span style={{ fontWeight: "500" }}>{`Type : `}</span>
                  <ClusterType
                    type={cluster.spec.clusterType}
                    params={cluster.spec.params}
                  />
                </span>
              </div>
            </div>
            {isClusterReady && customLabels.length > 0 && (
              <div className="row mt-2">
                <div className="col-md-12">
                  <span style={{ fontWeight: "500", marginRight: "5px" }}>
                    Cluster Labels :{" "}
                  </span>
                  <span style={{ fontSize: "12px" }}>
                    <LabelItem item={customLabels[0]} />
                  </span>
                </div>
              </div>
            )}
            <div className="row mt-2">
              <div className="col-md-12">
                <span style={{ fontWeight: "500", marginRight: "5px" }}>
                  Location :{" "}
                </span>
                <span style={{ fontSize: "12px" }}>
                  {props.getEdgeLocation(cluster)}
                </span>
                <i
                  className="zmdi zmdi-gps-dot"
                  onClick={() => props.callEdgeLocation(cluster)}
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    color: "teal",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-md-1 p-0">
            {isClusterReady && (
              <>
                {props.UserSession.visibleAdmin &&
                  cluster?.project_id === currentProjectId &&
                  (cluster?.projects?.length > 1 ||
                    cluster.shareMode === "ALL") && (
                    <CountCard
                      title="Sharing"
                      count={
                        cluster.shareMode === "ALL"
                          ? "ALL PROJECTS"
                          : cluster?.projects.length - 1
                      }
                      onClick={() => setOpenClusterSharing(!openClusterSharing)}
                      countFontSize={
                        cluster.shareMode === "ALL" ? "smaller" : "large"
                      }
                    />
                  )}
                {cluster?.project_id &&
                  cluster?.project_id !== currentProjectId && (
                    <div>
                      <div className="mb-0 mt-3" style={{ fontWeight: "500" }}>
                        Sharing
                      </div>
                      <div>Inherited from</div>
                      <div>
                        {
                          props.projectList?.find(
                            (p) => p.id === cluster.project_id
                          )?.name
                        }
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="col-md-5">
            <div style={{ marginLeft: "10%" }}>
              <ClusterStatusInfo
                cluster={cluster}
                isClusterReady={isClusterReady}
                statusColorStyle={props.statusColorStyle}
                openProvisionScreen={openProvisionScreen}
              />
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default SlatList;
