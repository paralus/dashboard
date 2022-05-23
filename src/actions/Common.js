import Cookies from "js-cookie";
import http from "./Config";

export function captcha() {
  return function (dispatch) {
    http("auth")
      .get("captchatext/")
      .then((response) => {
        dispatch({
          type: "captcha_refresh_success",
          payload: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: "captcha_refresh_error",
          payload: error.response.data,
        });
      });
  };
}

export function setPagination(pagination_type, rowsPerPage, offset, page) {
  return {
    type: "update_pagination",
    payload: {
      type: pagination_type,
      data: { rowsPerPage, offset, page },
    },
  };
}

export function getFilterQuery(filter) {
  return Object.entries(filter).reduce((acc, [key, value]) => {
    if (!value) return acc;
    if (key === "timefrom") value = `now-${value}`;
    if (key === "project") {
      key = "projects";
      value = value.join("&filter.projects=");
    }
    if (key === "partner_id") {
      return `${acc}&metadata.partner=${value}`;
    }
    if (key === "organization_id") {
      return `${acc}&metadata.organization=${value}`;
    }
    return `${acc}&filter.${key}=${value}`;
  }, "");
}

export function getQuery(type, options) {
  return Object.entries(options).reduce((acc, [key, value]) => {
    if (!value && value !== 0) return acc;
    return `${acc}&${type}.${key}=${value}`;
  }, "");
}
