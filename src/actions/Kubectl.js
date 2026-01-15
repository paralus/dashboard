export function openKubectlDrawer(
  projectId,
  clusterName,
  namespace,
  command,
  kubectl_type,
  edge_id,
  isLogsOnly
) {
  return {
    type: "open_kubectl_drawer",
    projectId,
    clusterName,
    namespace,
    command,
    kubectl_type,
    edge_id,
    isLogsOnly,
  };
}

export function closeKubectlDrawer() {
  return { type: "close_kubectl_drawer" };
}
