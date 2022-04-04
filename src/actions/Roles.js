import http from "./Config";

export function getRoles() {
    const partner = JSON.parse(window?.localStorage.getItem("partner"));
    const organization = JSON.parse(window?.localStorage.getItem("organization"));
    return function (dispatch) {
      http("auth")
        .get(`partner/${partner}/organization/${organization}/roles`)
        .then((response) => {
          console.log(response);
          dispatch({ type: "get_roles_success", payload: response });
        })
        .catch((error) => {
          console.log(error);
        });
    };
}

export function getRoleDetail(role) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .get(`partner/${partner}/organization/${organization}/role/${role}`)
      .then((response) => {
        dispatch({ type: "get_roledetail_success", payload: response });
      })
      .catch((error) => {
        console.log("getRoleDetail", error);
      });
  };
}

export function resetRolesList() {
    return { type: "reset_roles_list" };
}

export function resetRole() {
    return { type: "reset_role" };
}

export function getRolePermissions() {
    return function (dispatch) {
      http("auth")
        .get("rolepermissions")
        .then((response) => {
          console.log(response);
          dispatch({ type: "get_rolepermission_success", payload: response });
        })
        .catch((error) => {
          console.log(error);
        });
    };
}

export function createRole(data) {
    const partner = JSON.parse(window?.localStorage.getItem("partner"));
    const organization = JSON.parse(window?.localStorage.getItem("organization"));
    return function (dispatch) {
      http("auth")
        .post(`partner/${partner}/organization/${organization}/roles`, data)
        .then((response) => {
          dispatch({ type: "create_role_success", payload: response });
        })
        .catch((error) => {
          dispatch({
            type: "create_role_error",
            payload: error.response.data,
          });
        });
    };
}

export function editRoleWithCallback(data, onSuccess, onFailure) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .put(
        `partner/${partner}/organization/${organization}/role/${data.metadata.name}`,
        data
      )
      .then((_) => {
        dispatch(getRoleDetail(data.metadata.name));
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

export function removeRole(name) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
      http("auth")
      .delete(
          `partner/${partner}/organization/${organization}/role/${name}`,
          {}
      )
      .then((response) => {
          dispatch({
          type: "delete_role_success",
          payload: response,
          });
          dispatch(getRoles());
      })
      .catch((error) => {
          dispatch({
          type: "delete_role_error",
          payload: error.response.data,
          });
      });
  };
}

export function resetRolePermissions() {
  return { type: "reset_role_permissions" };
}