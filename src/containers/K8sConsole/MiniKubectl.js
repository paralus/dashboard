import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { closeKubectlDrawer } from "actions/index";
import DrawerWrapper from "./wrappers/DrawerWrapper";
import Kubectl from "./Kubectl";

const MiniKubectl = ({
  clusterName,
  projectId,
  namespace,
  open,
  closeKubectlDrawer,
  command,
  kubectl_type,
  edge_id,
  isLogsOnly,
}) => {
  if (!open) return null;
  return (
    <DrawerWrapper>
      <Kubectl
        clusterName={clusterName}
        projectId={projectId}
        namespace={namespace}
        showOpenInNew
        handleDrawerClose={closeKubectlDrawer}
        height="200px"
        command={command}
        kubectl_type={kubectl_type}
        edge_id={edge_id}
        isLogsOnly={isLogsOnly}
      />
    </DrawerWrapper>
  );
};

const mapStateToProps = ({ Kubectl }) => {
  const {
    clusterName,
    projectId,
    namespace,
    open,
    command,
    kubectl_type,
    edge_id,
    isLogsOnly,
  } = Kubectl;
  return {
    clusterName,
    projectId,
    namespace,
    open,
    command,
    kubectl_type,
    edge_id,
    isLogsOnly,
  };
};

export default withRouter(
  connect(mapStateToProps, { closeKubectlDrawer })(MiniKubectl),
);
