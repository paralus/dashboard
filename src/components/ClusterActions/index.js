import { downloadClusterConfig, removeCluster } from "actions/index";
import {
  DEFAULT_MENU_ITEMS,
  MENU_ITEMS,
  NOT_READY_MENU_ITEMS,
} from "constants/ClusterActions";
import { downloadFile, parseError, useSnack } from "utils";
import {
  ClusterViewContext,
  ClusterActionsContext,
} from "views/ClusterView/ClusterViewContexts";
import ClusterLabelEditor from "views/ClusterView/components/ClusterLabelEditor";
import ClusterActionsContainer from "components/ClusterActionsContainer";
import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DeleteClusterDialog from "./DeleteClusterDialog";
import KubectlSettings from "./KubectlSettings";
import ClusterActionDialog from "./ClusterActionDialog";
import ClusterSharingDialog from "./ClusterSharingDialog";
import EditLabelDialog from "./EditLabelDialog";

const ClusterActions = ({
  edge,
  userRole,
  isTableView,
  isDetails,
  resumeAutoRefresh = null,
  pauseAutoRefresh = null,
}) => {
  const { UserSession, project, partnerDetail } = useContext(
    ClusterActionsContext
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { showSnack } = useSnack();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [editLabelOpen, setEditLabelOpen] = useState(false);
  const [shareClusterOpen, setShareClusterOpen] = useState(false);
  const [kubectlOpen, setKubectlOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const icon = isTableView ? "more-vert" : "settings";
  const isImportedOrV2 = ["v2", "imported"].includes(edge?.spec.clusterType);

  const isClusterReady = () => {
    let ready = false;
    if (
      edge?.spec.clusterData &&
      edge?.spec.clusterData.cluster_status &&
      edge?.spec.clusterData.cluster_status.conditions &&
      edge?.spec.clusterData.cluster_status.conditions.length > 0
    ) {
      for (
        let index = 0;
        index < edge?.spec.clusterData?.cluster_status?.conditions?.length;
        index++
      ) {
        ready =
          edge.spec.clusterData.cluster_status.conditions[index].type ===
            "ClusterReady" &&
          edge.spec.clusterData.cluster_status.conditions[index].status === 3;
        if (ready) {
          return ready;
        }
      }
    }
    return ready;
  };

  const initiateMenuItems = () => {
    // Filter used intead of if else to maintain order mentioned in constant
    let menuItems = MENU_ITEMS.filter((item) => {
      return (
        DEFAULT_MENU_ITEMS.includes(item) ||
        (!isDetails && item === "View") ||
        (isImportedOrV2 && item === "Configure Ingress IPs") ||
        (UserSession.visibleAdmin && item === "Manage Cluster Sharing")
      );
    });
    // Remove actions for Non ready clusters
    if (!isClusterReady)
      menuItems = menuItems.filter((item) =>
        NOT_READY_MENU_ITEMS.includes(item)
      );
    setMenuItems(menuItems);
  };

  const deleteEdge = () => {
    dispatch(removeCluster(edge.metadata.name, forceDelete));
    history.push("/app/edges");
  };

  const onSelect = (innerText) => {
    switch (innerText) {
      case "View":
        history.push(`${history.location.pathname}/${edge.metadata.name}`);
        break;
      case "Delete":
        if (pauseAutoRefresh) pauseAutoRefresh();
        setDeleteOpen(true);
        break;
      case "Edit Labels":
        if (pauseAutoRefresh) pauseAutoRefresh();
        setEditLabelOpen(true);
        break;
      case "Manage Cluster Sharing":
        if (pauseAutoRefresh) pauseAutoRefresh();
        setShareClusterOpen(true);
        break;
      case "Kubectl Settings":
        if (pauseAutoRefresh) pauseAutoRefresh();
        setKubectlOpen(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    initiateMenuItems();
  }, [edge, userRole]);

  const KubectlSettingsDialog = () => {
    const cancelAction = {};
    const action = {};
    const header = (
      <div className="w-100 d-flex justify-content-between">
        <div>Kubectl Settings</div>
        <div style={{ fontSize: "14px" }} className="d-flex align-items-center">
          <div>Cluster: {edge.metadata.name}</div>
        </div>
      </div>
    );

    cancelAction.onClick = () => {
      setKubectlOpen(false);
      if (resumeAutoRefresh) resumeAutoRefresh();
    };
    action.isHidden = true;
    cancelAction.isHidden = true;
    const content = (
      <KubectlSettings
        open={kubectlOpen}
        onClose={cancelAction.onClick}
        edge={edge}
      />
    );

    return (
      <ClusterActionDialog
        isOpen={kubectlOpen}
        header={header}
        content={content}
        action={action}
        cancelAction={cancelAction}
      />
    );
  };

  const dialogs = [
    <DeleteClusterDialog
      edge={edge}
      isOpen={deleteOpen}
      onClose={() => {
        setDeleteOpen(false);
        if (resumeAutoRefresh) resumeAutoRefresh();
      }}
    />,
    <EditLabelDialog
      edge={edge}
      isOpen={editLabelOpen}
      onClose={() => {
        setEditLabelOpen(false);
        if (resumeAutoRefresh) resumeAutoRefresh();
      }}
    />,
    <KubectlSettingsDialog />,
    <ClusterSharingDialog
      edge={edge}
      isOpen={shareClusterOpen}
      onClose={() => {
        setShareClusterOpen(false);
        if (resumeAutoRefresh) resumeAutoRefresh();
      }}
    />,
  ];

  return (
    <ClusterActionsContainer
      icon={icon}
      menuItems={menuItems}
      dialogs={dialogs}
      onSelect={onSelect}
    />
  );
};

export default React.memo(ClusterActions);
