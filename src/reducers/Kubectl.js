const initialData = {
  open: false,
  clusterName: null,
  projectId: null,
  isLogsOnly: false,
  kubectlConfig: null,
};

const Kubectl = (state = initialData, action) => {
  switch (action.type) {
    case "kubeconfig_settings":
      return {
        ...state,
        kubectlConfig: action.payload,
      };
    case "open_kubectl_drawer":
      // if (state.open) return state;
      return {
        ...state,
        open: true,
        clusterName: action.clusterName,
        projectId: action.projectId,
        namespace: action.namespace,
        command: action.command,
        kubectl_type: action.kubectl_type,
        edge_id: action.edge_id,
        isLogsOnly: action.isLogsOnly,
      };
    case "close_kubectl_drawer":
      return {
        ...state,
        open: false,
        clusterName: null,
        projectId: null,
        isLogsOnly: false,
      };
    default:
      return state;
  }
};

export default Kubectl;
