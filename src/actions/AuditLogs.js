import http from "./Config";
import { getFilterQuery } from "./Common";

export function getAuditLogs(filter, projectId) {
  const partner = JSON.parse(window?.localStorage.getItem("partner_id"));
  const organization = JSON.parse(window?.localStorage.getItem("organization_id"));
  filter = { ... filter, partner_id: partner, organization_id: organization }
  const query = getFilterQuery(filter);

  let url = "auditlog?";
  if (projectId) url = `project/${projectId}/${url}`;

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
  const partner = JSON.parse(window?.localStorage.getItem("partner_id"));
  const organization = JSON.parse(window?.localStorage.getItem("organization_id"));
  filter = { ... filter, partner_id: partner, organization_id: organization }
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
