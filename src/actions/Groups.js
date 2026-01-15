import http from "./Config";

export function getGroups() {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    dispatch({ type: "get_groups_load" });
    http("auth")
      .get(`partner/${partner}/organization/${organization}/groups?limit=1000`)
      .then((response) => {
        dispatch({ type: "get_groups_success", payload: response });
      })
      .catch((error) => {
        dispatch({ type: "get_groups_error", payload: error.response.data });
        console.log("group", error);
      });
  };
}

export function getGroupDetail(group) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .get(`partner/${partner}/organization/${organization}/group/${group}`)
      .then((response) => {
        dispatch({ type: "get_group_detail_success", payload: response });
      })
      .catch((error) => {
        console.log("getGroupDetail", error);
      });
  };
}

export function createGroup(data) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .post(`partner/${partner}/organization/${organization}/groups`, data)
      .then((response) => {
        dispatch({ type: "create_group_success", payload: response });
        // dispatch(getGroups());
      })
      .catch((error) => {
        dispatch({
          type: "create_group_error",
          payload: error.response.data,
        });
      });
  };
}

export function updateGroup(data) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .put(
        `partner/${partner}/organization/${organization}/group/${data.metadata.name}`,
        data,
      )
      .then((response) => {
        dispatch({
          type: "update_group_success",
          payload: response,
        });
        dispatch(getGroups());
      })
      .catch((error) => {
        dispatch({
          type: "update_group_error",
          payload: error.response.data,
        });
      });
  };
}

export function editGroupWithCallback(data, onSuccess, onFailure) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .put(
        `partner/${partner}/organization/${organization}/group/${data.metadata.name}`,
        data,
      )
      .then((_) => {
        dispatch(getGroupDetail(data.metadata.name));
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

export function removeGroup(name) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function (dispatch) {
    http("auth")
      .delete(
        `partner/${partner}/organization/${organization}/group/${name}`,
        {},
      )
      .then((response) => {
        dispatch({
          type: "delete_group_success",
          payload: response,
        });
        dispatch(getGroups());
      })
      .catch((error) => {
        dispatch({
          type: "delete_group_error",
          payload: error.response.data,
        });
      });
  };
}

export function resetGroup() {
  return { type: "reset_group" };
}

export function resetGroupList() {
  return { type: "reset_group_list" };
}

export function resetGroupUsers() {
  return { type: "reset_group_users" };
}
