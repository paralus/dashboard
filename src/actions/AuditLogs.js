import http from "./Config";
import { getFilterQuery } from "./Common";

export function getAuditLogs(filter, project) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  filter = { ...filter, partner: partner, organization: organization };
  const query = getFilterQuery(filter);

  let url = "auditlog?";
  if (project) url = `project/${project}/${url}`;

  return function (dispatch) {
    dispatch({ type: "load_audit_logs" });
    http("event", "v1")
      .get(`${url}${query}`)
      .then((response) => {
        dispatch({ type: "get_audit_logs", payload: response.data?.result });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getKubectlLogs(filter, type = "RelayCommands") {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  filter = { ...filter, partner: partner, organization: organization };
  let query = `auditType=${type}`;
  query += getFilterQuery(filter);

  return function (dispatch) {
    dispatch({ type: "load_audit_logs" });
    http("event", "v1")
      .get(`audit/relay?${query}`)
      .then((response) => {
        dispatch({
          type: `get_kubectl_${type}_logs`,
          payload: response.data?.result,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
