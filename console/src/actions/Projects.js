import http from "./Config";

export function getProjects(partner, organization) {
  return function(dispatch) {
    http("auth")
      .get(`partner/${partner}/organization/${organization}/projects?limit=1000&order=ASC&orderby=name`)
      .then(response => {
        dispatch({ type: "get_projects_success", payload: response });
      })
      .catch(error => {
        console.log(error);
      });
  };
}

export function getProjectList(limit = 25, offset = 0) {
  return http("auth").get(
    `partner/${partner}/organization/${organization}/projects?limit=${limit}&offset=${offset}&order=DESC&orderby=createdAt`
  );
}

export function getInitProjects(partner, organization) {
  return function(dispatch) {
    const cachedProject = JSON.parse(
      window?.localStorage?.getItem("currentProject")
    );

    http("auth")
      .get(`partner/${partner}/organization/${organization}/projects?limit=1000&order=DESC&orderby=name`) // Dirty fix for Default project getting lost because of pagination
      .then(response => {
        let currentProject = null;
        if (cachedProject) {
          const found = response.data?.results?.find(
            p => p.id === cachedProject
          );
          if (found) {
            currentProject = found;
          } else {
            const defaultProject = response.data.results.find(p => p.default);
            currentProject =
              defaultProject || response.data.results[response.data.count - 1];
          }
        } else {
          const defaultProject = response.data.results.find(p => p.default);
          currentProject =
            defaultProject || response.data.results[response.data.count - 1];
        }
        dispatch({
          type: "get_init_projects_success",
          payload: response,
          currentProject
        });
        dispatch({
          type: "set_session_current_project",
          payload: currentProject.id
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
}

export function createProject(partner, organization, params, onSuccess = null, onFailure = null) {
  return function(dispatch) {
    http("auth")
      .post(`partner/${partner}/organization/${organization}/project`, params)
      .then(response => {
        dispatch({ type: "create_project_success", payload: response });
        dispatch(getProjects());
        if (onSuccess) onSuccess();
      })
      .catch(error => {
        dispatch({
          type: "create_project_error",
          payload: error.response.data
        });
        if (onFailure) {
          if (error.response.data && error.response.data.details) {
            onFailure(error.response.data.details[0].detail);
          } else {
            onFailure(JSON.stringify(error.response.data));
          }
        }
      });
  };
}

export function updateProject(partner, organization, project, params) {
  return http("auth").put(`partner/${partner}/organization/${organization}/project/${project}`, params);
}

export function changeProject(project_id, noReload = false) {
  return function(dispatch) {
    dispatch({ type: "set_session_current_project", payload: project_id });
    dispatch({
      type: "set_current_project",
      payload: { id: project_id, noReload }
    });
    localStorage.setItem("currentProject", JSON.stringify(project_id));
  };
}

export function deleteProject(partner, organization, project, onSuccess, onFailure) {
  return function(dispatch) {
    http("auth")
      .delete(`partner/${partner}/organization/${organization}/project/${project}/`, {})
      .then(response => {
        dispatch({
          type: "delete_project_success",
          payload: response
        });
        if (onSuccess) onSuccess();
        dispatch(getProjects());
      })
      .catch(error => {
        if (onFailure) {
          if (error.response.data && error.response.data.details) {
            onFailure(error.response.data.details[0].detail);
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

export function getProject(partner, organization, project) {
  return function(dispatch) {
    http("auth")
      .get(`partner/${partner}/organization/${organization}/project/${project}/`)
      .then(response => {
        dispatch({
          type: "get_project_success",
          payload: response
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
}