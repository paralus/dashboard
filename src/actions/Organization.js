import http from "./Config";
import { getInitProjects } from "./Projects";

export function getOrganization(partner, name) {
  if (partner === "") {
    partner = JSON.parse(window?.localStorage.getItem("partner"));
  }
  if (name === "") {
    name = JSON.parse(window?.localStorage.getItem("organization"));
  }
  return function (dispatch) {
    http("auth")
      .get(`partner/${partner}/organization/${name}`)
      .then((response) => {
        dispatch({
          type: "get_organizations_success",
          payload: response.data,
        });
        localStorage.setItem(
          "organization_id",
          JSON.stringify(response.data.metadata.id)
        );
        localStorage.setItem(
          "organization",
          JSON.stringify(response.data.metadata.name)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export default function getInitOrganization(partner, callback) {
  return function (dispatch) {
    http("auth")
      .get(`partner/${partner}/organizations`)
      .then((response) => {
        dispatch({
          type: "get_organizations_success",
          payload: response.data.items[0],
        });
        localStorage.setItem(
          "organization_id",
          JSON.stringify(response.data.items[0].metadata.id)
        );
        localStorage.setItem(
          "organization",
          JSON.stringify(response.data.items[0].metadata.name)
        );
        dispatch(getInitProjects(callback));
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function saveOrganization(params) {
  console.log(`saveOrganization called ${params}`);
  return function (dispatch) {
    // dispatch({type: "workload_update_success", payload: params});
    http("auth")
      .put(
        `partner/${params.metadata.partner}/organization/${params.metadata.name}`,
        params
      )
      .then((response) => {
        console.log(response);
        dispatch({
          type: "organization_update_success",
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: "organization_response_error",
          payload: error.response.data,
        });
      });
  };
}

export function updateOragnization(params) {
  console.log(`updateOragnization called ${params}`);
  return http("auth").put(
    `partner/${params.metadata.partner}/organization/${params.metadata.name}`,
    params
  );
}

export function resetOrganizationError() {
  return { type: "organization_response_error_reset" };
}

export function resetOrganizationSuccess() {
  return { type: "organization_update_sucess_reset" };
}
