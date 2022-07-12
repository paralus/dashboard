import http from "./Config";

export function getProjects() {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .get(
        `partner/${partner}/organization/${organization}/projects?limit=1000&order=ASC&orderby=name`
      ) // Dirty fix for Default project getting lost because of pagination
      .then((response) => {
        dispatch({ type: "get_projects_success", payload: response });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getProjectList(limit = 25, offset = 0) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return http("auth").get(
    `partner/${partner}/organization/${organization}/projects?limit=${limit}&offset=${offset}&order=DESC&orderby=createdAt`
  );
}

export function getInitProjects(callback) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    const cachedProject = JSON.parse(
      window?.localStorage?.getItem("currentProject")
    );

    http("auth")
      .get(
        `partner/${partner}/organization/${organization}/projects?limit=1000&order=DESC&orderby=name`
      ) // Dirty fix for Default project getting lost because of pagination
      .then((response) => {
        let currentProject = null;
        if (cachedProject) {
          const found = response.data?.items?.find(
            (p) => p.metadata.name === cachedProject
          );
          if (found) {
            currentProject = found;
          } else {
            const defaultProject = response.data.items.find(
              (p) => p.spec.default
            );
            currentProject =
              defaultProject ||
              response.data.items[response.data.items.length - 1];
          }
        } else {
          const defaultProject = response.data.items.find(
            (p) => p.spec.default
          );
          currentProject =
            defaultProject ||
            response.data.items[response.data.items.length - 1];
        }
        dispatch({
          type: "get_init_projects_success",
          payload: response,
          currentProject,
        });
        dispatch({
          type: "set_session_current_project",
          payload: currentProject,
        });
        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function createProject(params, onSuccess = null, onFailure = null) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  let reqData = {
    metadata: { name: params.name, description: params.description },
  };
  return function (dispatch) {
    http("auth")
      .post(`partner/${partner}/organization/${organization}/project`, reqData)
      .then((response) => {
        dispatch({ type: "create_project_success", payload: response });
        dispatch(getProjects(partner, organization));
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        dispatch({
          type: "create_project_error",
          payload: error.response.data,
        });
        if (onFailure) {
          if (error.response.data) {
            onFailure(error.response.data.message);
          } else {
            onFailure(JSON.stringify(error.response.data));
          }
        }
      });
  };
}

export function updateProject(project, params) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return http("auth").put(
    `partner/${partner}/organization/${organization}/project/${project}`,
    params
  );
}

export function changeProject(project, noReload = false) {
  return function (dispatch) {
    dispatch({ type: "set_session_current_project", payload: project });
    dispatch({
      type: "set_current_project",
      payload: { name: project, noReload },
    });
    localStorage.setItem("currentProject", JSON.stringify(project));
  };
}

export function deleteProject(name, onSuccess, onFailure) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .delete(
        `partner/${partner}/organization/${organization}/project/${name}`,
        {}
      )
      .then((response) => {
        dispatch({
          type: "delete_project_success",
          payload: response,
        });
        if (onSuccess) onSuccess();
        dispatch(getProjects(partner, organization));
      })
      .catch((error) => {
        if (onFailure) {
          if (error.response.data) {
            onFailure(error.response.data.message);
          } else {
            onFailure(JSON.stringify(error.response.data));
          }
        }
      });
  };
}

export function resetChangeProject() {
  return { type: "reset_change_project" };
}

export function resetProjectError() {
  return { type: "reset_project_error" };
}

export function getProject(project) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .get(`partner/${partner}/organization/${organization}/project/${project}`)
      .then((response) => {
        dispatch({
          type: "get_project_success",
          payload: response,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function editProjectWithCallback(data, onSuccess, onFailure) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .put(
        `partner/${partner}/organization/${organization}/project/${data.metadata.name}`,
        data
      )
      .then((_) => {
        dispatch(getProject(data.metadata.name));
        onSuccess();
      })
      .catch((error) => {
        if (error.response.data) {
          onFailure(error.response.data.message);
        } else {
          onFailure(error.response.data);
        }
      });
  };
}

export function resetProjectEditUser() {
  return { type: "reset_users_userdetail" };
}
