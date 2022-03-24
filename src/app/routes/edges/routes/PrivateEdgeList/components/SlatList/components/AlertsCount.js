import React from "react";
import IconButton from "@material-ui/core/IconButton";

export default function AlertsCount(props) {
  const { edgeId, pop, outstandingAlerts } = props;
  let alert = null;
  if (outstandingAlerts && outstandingAlerts.clusterOutstandingCount) {
    alert = outstandingAlerts.clusterOutstandingCount[edgeId];
  }
  if (!alert) {
    alert = {
      info: 0,
      warning: 0,
      critical: 0,
    };
  }
  if (pop) {
    return (
      <span>
        <span style={{ marginLeft: "10px", color: "#2196F3" }}>
          Info : {alert.info}
        </span>
        <span style={{ marginLeft: "10px", color: "#ff9800" }}>
          Warning : {alert.warning}
        </span>
        <span style={{ marginLeft: "10px", color: "red" }}>
          Critical : {alert.critical}
        </span>
      </span>
    );
  }
  return (
    <div className="d-flex align-items-center">
      <IconButton className="size-30 p-0">
        <i className="zmdi zmdi-notifications-active mdc-text-teal" />
      </IconButton>
      <span>ALERTS</span>
      <span style={{ marginLeft: "10px" }}>
        <span className="ml-auto badge badge-pill text-right text-white bg-blue mb-0">
          {alert.info}
        </span>
      </span>
      <span style={{ marginLeft: "10px" }}>
        <span className="ml-auto badge badge-pill text-right text-white bg-orange mb-0">
          {alert.warning}
        </span>
      </span>
      <span style={{ marginLeft: "10px" }}>
        <span className="ml-auto badge badge-pill text-right text-white bg-red mb-0">
          {alert.critical}
        </span>
      </span>
    </div>
  );
}
