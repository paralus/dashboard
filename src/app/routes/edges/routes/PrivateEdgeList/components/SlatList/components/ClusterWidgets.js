import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

function ClusterWidgets({ edgeId, onKubectlClick, cluster }) {
  const KubectlConfig = useSelector((s) => s.Kubectl?.kubectlConfig);

  return (
    <div className="d-flex justify-content-between align-items-center">
      {KubectlConfig?.disableWebKubectl === undefined && (
        <div className="text-teal d-flex mx-2">
          <div
            style={{
              display: "inline",
              border: "2px solid #757575",
              borderTop: "5px solid #757575",
              paddingLeft: "3px",
              paddingRight: "3px",
              color: "#757575",
              fontSize: "14px",
              borderRadius: "2px",
              marginRight: "5px",
              lineHeight: "10px",
            }}
            onClick={onKubectlClick}
          >
            {">_"}
          </div>
          <div
            onClick={onKubectlClick}
            style={{
              fontWeight: "500",
              cursor: "pointer",
              marginLeft: "2px",
            }}
          >
            KUBECTL
          </div>
        </div>
      )}
    </div>
  );
}

export default ClusterWidgets;
