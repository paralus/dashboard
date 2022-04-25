import http from "./Config";

export function getEdges(
  project,
  rows = 1000,
  offset = 0,
  searchText = "",
  status = ""
) {
  return function (dispatch) {
    http("infra")
      .get(
        `project/${project}/cluster?limit=${rows}&offset=${offset}&q=${searchText}${status}`
      )
      .then((response) => {
        dispatch({ type: "get_edges_success", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "get_edges_error",
          payload: error.response?.data,
        });
      });
  };
}

export function getEdgeDetail(name) {
  const cachedProject = JSON.parse(
    window?.localStorage.getItem("currentProject")
  );
  return function (dispatch) {
    return new Promise((resolve, reject) => {
      http("infra")
        .get(`project/${cachedProject}/cluster/${name}`)
        .then((response) => {
          dispatch({
            type: "get_edge_detail_success",
            payload: response,
          });
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: "get_edge_detail_error",
            payload: error.response.data,
          });
          reject(error);
        });
    });
  };
}

export function getEdgeData(name) {
  const cachedProject = JSON.parse(
    window?.localStorage.getItem("currentProject")
  );
  return http("infra").get(`/project/${cachedProject}/cluster/${name}`);
}

export function assignProjectToCluster(edgeId, params, projectId) {
  return http("edge").post(
    `projects/${projectId}/edges/${edgeId}/assignprojects/`,
    params
  );
}

export function unassignProjectFromCluster(edgeId, params, projectId) {
  return http("edge").post(
    `projects/${projectId}/edges/${edgeId}/unassignprojects/`,
    params
  );
}

export function updateEdge(
  params,
  handleSuccessResponse,
  handleErrorResponse,
  handleUpdateEdge
) {
  const cachedProject = JSON.parse(
    window?.localStorage.getItem("currentProject")
  );
  return function (dispatch) {
    return http("infra")
      .put(`project/${cachedProject}/cluster/${params.metadata.name}`, params)
      .then((response) => {
        if (response.data.metadata.labels) {
          const labelArray = [];
          for (const k of Object.keys(response.data.metadata.labels)) {
            labelArray.push({
              key: k,
              value: response.data.metadata.labels[k],
            });
          }
          response.data.metadata.labels = labelArray;
        }
        dispatch({ type: "edge_update_success", payload: response });
        dispatch(getEdgeDetail(params.metadata.name));
        if (handleSuccessResponse) {
          handleSuccessResponse();
        }
        if (handleUpdateEdge) {
          handleUpdateEdge(response.data);
        }
      })
      .catch((error) => {
        if (handleUpdateEdge) {
          handleUpdateEdge(error.response.data);
        }
        if (handleErrorResponse) {
          handleErrorResponse(error?.response?.data);
          return;
        }
        dispatch({ type: "edge_update_error", payload: error.response.data });
      });
  };
}

export function createCluster(params) {
  const cachedProject = JSON.parse(
    window?.localStorage.getItem("currentProject")
  );
  return http("infra").post(`project/${cachedProject}/cluster`, params);
}

export function updateCluster(params) {
  const cachedProject = JSON.parse(
    window?.localStorage.getItem("currentProject")
  );
  return http("infra").put(
    `project/${cachedProject}/cluster/${params.metadata.name}`,
    params
  );
}

export function resetAddEdge() {
  return { type: "add_edge_reset" };
}

export function getDownloadBootstrapYAML(name) {
  const cachedProject = JSON.parse(
    window?.localStorage.getItem("currentProject")
  );
  return http(`infra/v3/project/${cachedProject}/cluster/`, false, {
    "content-type": "application/x-rafay-yaml",
  }).get(`${name}/download`);
}

export function resetClusterDetail() {
  return function (dispatch) {
    dispatch({ type: "reset_cluster_detail" });
  };
}

export function getClusterStatus(cluster_name, projectId) {
  return function (dispatch) {
    http(`v2/scheduler/project/${projectId}/cluster`, false)
      .get(`/${cluster_name}`)
      .then((response) => {
        dispatch({ type: "cluster_status_success", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "cluster_status_error",
          payload: error.response.data,
        });
        console.log(error);
      });
  };
}

export function getClusterKubectlSettings(edgeId) {
  const orgId = JSON.parse(
    window?.localStorage.getItem("organization_id")
  );
  return http("v2/sentry/kubectl/cluster", "").get(`${edgeId}/settings?opts.organization=` + orgId);
}

export function setClusterKubectlSettings(edgeId, params) {
  const orgId = JSON.parse(
    window?.localStorage.getItem("organization_id")
  );
  params.opts = {
    organization: orgId
  }
  return http("v2/sentry/kubectl/cluster/", "").put(
    `${edgeId}/settings`,
    params
  );
}

export function removeCluster(name, force) {
  const cachedProject = JSON.parse(
    window?.localStorage.getItem("currentProject")
  );
  return function (dispatch) {
    http("infra")
      .delete(`project/${cachedProject}/cluster/${name}?force=${force}`, {})
      .then((response) => {
        dispatch({ type: "edge_delete_success", payload: response });
      })
      .catch((error) => {
        dispatch({ type: "edge_delete_error", payload: error.response.data });
      });
  };
}

export function edgeDetailReset() {
  return { type: "edge_detail_reset" };
}
