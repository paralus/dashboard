import React from "react";
import { useHistory } from "react-router";

const color = {
  Success: "teal",
  NotSet: "gray",
  InProgress: "blue",
  Pending: "gray",
  Failed: "red"
};

function BlueprintSyncStatus({ edge, isHeader }) {
  const history = useHistory();

  const openBpStatus = () => {
    history.push(`/app/edges/${edge.id}/blueprint`);
  };

  const bpSync = edge?.cluster?.status?.conditions?.find(
    x => x.type === "ClusterBlueprintSync"
  );

  const blueprintSyncStatus = bpSync?.status || "NOTSET";

  return (
    <div className="row mt-2">
      <div className="col-md-12 ">
        <span className="fontWeight500 mr-2">Blueprint Sync :</span>
        <span
          className="text-uppercase"
          style={{ color: color[blueprintSyncStatus] }}
        >
          {blueprintSyncStatus}
        </span>
        {blueprintSyncStatus?.toUpperCase() !== "NOTSET" && (
          <span onClick={openBpStatus} className="ml-2 pointer">
            <i className="zmdi zmdi-open-in-new zmdi-hc-lg text-teal" />
          </span>
        )}
      </div>
    </div>
  );
}

export default BlueprintSyncStatus;
