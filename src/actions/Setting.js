import {
  DRAWER_TYPE,
  THEME_COLOR,
  TOGGLE_COLLAPSED_NAV,
} from "../constants/ActionTypes";
import http from "./Config";

export function toggleCollapsedNav(isNavCollapsed) {
  return { type: TOGGLE_COLLAPSED_NAV, isNavCollapsed };
}

export function setDrawerType(drawerType) {
  return { type: DRAWER_TYPE, drawerType };
}

export function setThemeColor(color) {
  return { type: THEME_COLOR, color };
}

export function getOrgKubeconfigValidity(orgId) {
  return http(
    `v2/sentry/kubeconfig/organization/${orgId}/setting`,
    "",
    true
  ).get();
}

export function setOrgKubeconfigValidity(orgId, accId, params) {
  params.opts = {
    organization: orgId,
    account: accId,
  };
  return http(
    `v2/sentry/kubeconfig/organization/${orgId}/setting`,
    "",
    true
  ).put("", params);
}

export function getOrgKubeconfigSettings(orgId) {
  return function (dispatch) {
    http(`v2/sentry/kubeconfig/organization/${orgId}/setting`, "", true)
      .get()
      .then((response) => {
        dispatch({ type: "kubeconfig_settings", payload: response?.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getLang(lang) {
  console.log("lang:", lang);
  return { type: "get_language", payload: lang };
}

export function getWId(Wid) {
  console.log("Wid:", Wid);
  return { type: "get_Wid", payload: Wid };
}

export function getTimeStamp(t) {
  console.log("widgetList time_stamp:", t);
  return { type: "get_timestamp", payload: t };
}

export function setDefaultClusterStatus(data) {
  return { type: "set_default_cluster_status", payload: data };
}
