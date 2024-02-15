import React from "react";
import ResourceDialog from "components/ResourceDialog";
import Moment from "moment";

function isClusterAvailable(cluster) {
  let ready = false;
  if (
    cluster?.spec.clusterData &&
    cluster?.spec.clusterData.cluster_status &&
    cluster?.spec.clusterData.cluster_status.conditions &&
    cluster?.spec.clusterData.cluster_status.conditions.length > 0
  ) {
    for (
      let index = 0;
      index < cluster?.spec.clusterData?.cluster_status?.conditions?.length;
      index++
    ) {
      ready =
        cluster.spec.clusterData.cluster_status.conditions[index].type ===
          "ClusterHealth" &&
        cluster.spec.clusterData.cluster_status.conditions[index].status ===
          "Healthy";
      if (ready) {
        return ready;
      }
    }
  }
  return ready;
}

function getClusterLastCheckedIn(cluster) {
  let ready = false;
  if (cluster?.spec?.clusterData?.cluster_status?.conditions?.length > 0) {
    let len = cluster.spec.clusterData.cluster_status.conditions.length;
    for (let index = 0; index < len; index++) {
      ready =
        cluster.spec.clusterData.cluster_status.conditions[index].type ===
        "ClusterHealth";
      if (ready) {
        return cluster.spec.clusterData.cluster_status.conditions[index]
          .lastUpdated;
      }
    }
  }
  return null;
}

function ClusterStatusInfo({
  cluster,
  isClusterReady,
  statusColorStyle,
  openProvisionScreen,
}) {
  if (!cluster) return null;
  const isImported = cluster.clusterType === "imported";
  let lastCheckedIn = getClusterLastCheckedIn(cluster);
  return (
    <div>
      {isClusterReady && (
        <>
          <div className="row ">
            <div className="col-md-12">
              <span style={{ fontWeight: "500", marginRight: "5px" }}>
                Cluster Connection :{" "}
              </span>
              <span style={{ fontSize: "14px" }}>
                {isClusterAvailable(cluster) ? (
                  <span style={{ color: "teal" }}>SUCCESS</span>
                ) : (
                  <span style={{ color: "red" }}>FAILURE</span>
                )}
              </span>
              {cluster && (
                <span
                  style={{
                    marginLeft: "10px",
                    color: "grey",
                    fontSize: "smaller",
                  }}
                >
                  Last check in&nbsp;
                  {lastCheckedIn != null ? (
                    <span>
                      {Moment(
                        new Date(
                          lastCheckedIn.seconds * 1000 +
                            lastCheckedIn.nanos / 1e6
                        )
                      ).fromNow()}
                    </span>
                  ) : (
                    <span>Unknown</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ClusterStatusInfo;
