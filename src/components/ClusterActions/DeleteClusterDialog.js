import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSnack } from "utils";
import { ClusterActionsContext } from "views/ClusterView/ClusterViewContexts";
import { removeCluster } from "actions/index";
import ClusterActionDialog from "./ClusterActionDialog";

const DeleteClusterDialog = ({ edge, isOpen, onClose }) => {
  const { project } = useContext(ClusterActionsContext);

  const [forceDelete, setForceDelete] = useState(false);

  const dispatch = useDispatch();
  const { showSnack } = useSnack();
  const history = useHistory();

  const cancelAction = {};
  const action = { color: "secondary" };
  const header = "Delete Cluster";
  const content = `Are you sure you want to remove the cluster ( ${edge.metadata.name} ) ?`;
  const checkBox = {
    checked: forceDelete,
    label: "Force Delete Cluster",
    onChange: () => setForceDelete(!forceDelete),
    checkedText:
      "This is a disruptive operation and can leave dangling resources in cloud provider.",
  };

  const deleteEdge = () => {
    dispatch(removeCluster(edge.metadata.name, forceDelete));
    history.push("/app/edges");
  };

  cancelAction.onClick = () => {
    setForceDelete(false);
    onClose();
  };
  action.onClick = deleteEdge;

  return (
    <ClusterActionDialog
      isOpen={isOpen}
      header={header}
      content={content}
      action={action}
      cancelAction={cancelAction}
      checkBox={checkBox}
    />
  );
};

export default DeleteClusterDialog;
