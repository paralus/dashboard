import http from "./Config";

export function getUsers(
  rows,
  offset,
  searchText,
  orderBy = "",
  order = "",
  filters
) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  if (!("type" in filters)) {
    filters["type"] = "password";
  }
  let filterQuery = "";
  const filterKeys = Object.keys(filters || {});
  filterKeys.forEach((key) => {
    const value = Array.isArray(filters[key])
      ? filters[key].join(",")
      : filters[key];
    if (value && value !== "ALL") filterQuery += `&${key}=${value}`;
  });
  filterQuery += `&partner=${partner}`;
  filterQuery += `&organization=${organization}`;
  if (rows) {
    filterQuery += `&limit=${rows}`;
  } else {
    filterQuery += `&limit=-1`;
  }
  if (offset) filterQuery += `&offset=${offset}`;
  if (orderBy) filterQuery += `&orderBy=${orderBy}&order=${order}`;

  return function (dispatch) {
    dispatch({ type: "get_users_loading_state", payload: true });
    http("auth")
      .get(`users?q=${searchText || ""}${filterQuery}`)
      .then((response) => {
        console.log(response);
        dispatch({ type: "get_users_success", payload: response });
        dispatch({ type: "get_users_loading_state", payload: false });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: "get_users_loading_state", payload: false });
      });
  };
}

export function getApproverUserList() {
  return http("v2/sentry/account/-/approver", "", true).get();
}

export function getApproverIDPUserList() {
  return http("v2/sentry/account/-/approver?SSO=true", "", true).get();
}

export function getUserList() {
  return http("auth").get(`users`);
}

export function getUserDetail(name) {
  return function (dispatch) {
    http("auth")
      .get(`user/${name}`)
      .then((response) => {
        console.log(response);
        dispatch({ type: "get_user_detail_success", payload: response });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getSSOUserDetail(name) {
  return http("auth").get(`user/${name}`);
}

export function addUser(params) {
  return function (dispatch) {
    http("auth")
      .post("users/", params)
      .then((response) => {
        dispatch({ type: "add_user_success", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "user_response_error",
          payload: error.response.data,
        });
        console.log(error);
      });
  };
}

export function addUserWithCallback(params, onSuccess, onFailure) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  params.metadata.partner = partner;
  params.metadata.organization = organization;
  return function (dispatch) {
    http("auth")
      .post("users", params)
      .then((response) => {
        dispatch({ type: "add_user_success", payload: response });
        onSuccess(response.data);
      })
      .catch((error) => {
        if (error.response.data) {
          const data = error.response.data;
          let text = "";
          if (data.code) {
            text = data.message;
          } else {
            text = Object.keys(data)
              ?.map((e, i) => {
                return `[${e}] ${data[e]}`;
              })
              .join(", ");
          }
          onFailure(text);
        } else {
          onFailure(error.response.data);
        }
        console.log(error);
      });
  };
}

export function assignUserToProject(userId, params, onSuccess, onFailure) {
  return function (dispatch) {
    http("auth")
      .post(`users/${userId}/assigntoproject/`, params)
      .then((response) => {
        // dispatch({ type: "assign_user_to_project_success", payload: response });
        onSuccess();
      })
      .catch((error) => {
        onFailure(error);
        dispatch({
          type: "assign_user_to_project_error",
          payload: error.response.data,
        });
        console.log(error);
      });
  };
}

export function unassignUserFromProject(userId, params, onSuccess, onFailure) {
  return function (dispatch) {
    http("auth")
      .post(`users/${userId}/unassignfromproject/`, params)
      .then((response) => {
        // dispatch({ type: "assign_user_to_project_success", payload: response });
        onSuccess();
      })
      .catch((error) => {
        dispatch({
          type: "unassign_user_from_project_error",
          payload: error.response.data,
        });
        onFailure(error);
        console.log(error);
      });
  };
}

export function editUser(params) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  params.metadata.partner = partner;
  params.metadata.organization = organization;
  return function (dispatch) {
    console.log("editUser editUser");
    http("auth")
      .put(`user/${params.metadata.name}`, params)
      // .put(`accountroles/${params.id}/`, params)
      .then((response) => {
        dispatch({ type: "edit_user_success", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "user_response_error",
          payload: error.response.data,
        });
        console.log(error);
      });
  };
}

export function updateSSOUser(params) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  params.metadata.partner = partner;
  params.metadata.organization = organization;
  return http("auth").put(`user/${params.metadata.name}`, params);
}

export function editUserWithCallback(params, onSuccess, onFailure) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  params.metadata.partner = partner;
  params.metadata.organization = organization;
  return function (dispatch) {
    console.log("editUser with callback");
    http("auth")
      .put(`user/${params.metadata.name}`, params)
      // .put(`accountroles/${params.id}/`, params)
      .then((response) => {
        // dispatch({ type: "edit_user_success", payload: response });
        dispatch(getUserDetail(params.metadata.name));
        onSuccess(response);
      })
      .catch((error) => {
        if (error.response) {
          onFailure(error.response.message);
        } else {
          onFailure(error.response);
        }
        console.log(error);
      });
  };
}

export function createApiKey(accountrole_id, isSSOUser) {
  const params = { name: "dynamic" };
  if (isSSOUser) params.is_sso_user = true;
  return function (dispatch) {
    http("auth")
      .post(`users/${accountrole_id}/apikey/`, params)
      .then((response) => {
        dispatch({ type: "create_apikey_success", payload: response });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "create_apikey_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function getApiKeys(accountrole_id, isSSOUser) {
  let url = `user/${accountrole_id}/apikeys`;
  if (isSSOUser) url = `${url}?is_sso_user=true`;
  return function (dispatch) {
    http("auth")
      .get(url)
      .then((response) => {
        dispatch({ type: "get_apikeys_success", payload: response });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "get_apikey_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function getRegistryAuthKeys(accountrole_id) {
  return function (dispatch) {
    http("auth")
      .get(`users/${accountrole_id}/regauthkeys/`)
      .then((response) => {
        dispatch({
          type: "get_regauthkeys_success",
          payload: response,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "get_regauthkey_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function createRegistryAuthKey(accountrole_id, isSSOUser) {
  const params = {};
  if (isSSOUser) params.is_sso_user = true;
  return function (dispatch) {
    http("auth")
      .post(`users/${accountrole_id}/regauthkey/`, params)
      .then((response) => {
        dispatch({
          type: "create_regauthkeys_success",
          payload: response,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "create_regauthkey_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function deleteRegistryAuthKey(key_id) {
  return function (dispatch) {
    http("auth")
      .delete(`registryauthkeys/${key_id}/`)
      .then((response) => {
        dispatch({
          type: "delete_regauthkey_success",
          payload: response,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "delete_regauthkey_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function deleteApiKey(accountid, key_id) {
  return function (dispatch) {
    http("auth")
      .delete(`user/${accountid}/apikeys/${key_id}`)
      .then((response) => {
        dispatch({ type: "delete_apikey_success", payload: response });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "delete_apikey_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function deleteUser(user_id, onSuccess, onFailure) {
  return function (dispatch) {
    http("auth")
      .delete(`user/${user_id}`)
      .then((response) => {
        dispatch({ type: "delete_user_success", payload: response });
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (onFailure) onFailure(error);
        dispatch({
          type: "delete_user_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function getKubeconfigValidity(accountId, isSSOUser = false) {
  const orgid = JSON.parse(window?.localStorage.getItem("organization_id"));
  let type = "user";
  if (isSSOUser) type = "ssouser";
  return http(
    `v2/sentry/kubeconfig/${type}/${accountId}/setting?opts.organization=${orgid}`,
    "",
    true
  ).get();
}

export function setKubeconfigValidity(accountId, params, isSSOUser = false) {
  const orgid = JSON.parse(window?.localStorage.getItem("organization_id"));
  params.opts = {
    organization: orgid,
  };
  let type = "user";
  if (isSSOUser) type = "ssouser";
  return http(
    `v2/sentry/kubeconfig/${type}/${accountId}/setting`,
    "",
    true
  ).put("", params);
}

export function revokeKubeconfig(accountId, isSSOUser = false) {
  let type = "user";
  if (isSSOUser) type = "ssouser";
  const partnerId = JSON.parse(window?.localStorage.getItem("partner_id"));
  const organizationId = JSON.parse(
    window?.localStorage.getItem("organization_id")
  );
  let req = {
    opts: {
      partner: partnerId,
      organization: organizationId,
      account: accountId,
    },
  };
  return http(`v2/sentry/kubeconfig/revoke`, "", true).post("", req);
}

export function revokeSelfKubeconfig(accountId) {
  const partnerId = JSON.parse(window?.localStorage.getItem("partner_id"));
  const organizationId = JSON.parse(
    window?.localStorage.getItem("organization_id")
  );
  let req = {
    opts: {
      partner: partnerId,
      organization: organizationId,
      account: accountId,
    },
  };
  return http(`v2/sentry/kubeconfig/revoke`, "", true).post("", req);
}

export function resetPassword(email) {
  return http("auth").get(`user/${email}/forgotpassword`);
}

export function resetUser() {
  return { type: "reset_user" };
}

export function resetError() {
  return { type: "user_response_error_reset" };
}

export function resetUserResponse() {
  return { type: "user_response_reset" };
}

export function resetUserApiKeyResponse() {
  return { type: "user_apikey_response_reset" };
}

export function resetRegistryAuthKeyResponse() {
  return { type: "user_registryauth_response_reset" };
}

export function resetUserDeleteResponse() {
  return { type: "user_delete_response_reset" };
}

export function resetUserGroupDeleteError() {
  return { type: "user_group_delete_reset" };
}
