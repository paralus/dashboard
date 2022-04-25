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
          "ClusterReady" &&
        cluster.spec.clusterData.cluster_status.conditions[index].status ===
          "Success";
      if (ready) {
        return ready;
      }
    }
  }
  return ready;
}

function ClusterStatusInfo({
  cluster,
  isClusterReady,
  statusColorStyle,
  openProvisionScreen,
}) {
  if (!cluster) return null;
  const isImported = cluster.clusterType === "imported";
  return (
    <div>
      {isClusterReady && (
        <>
          <div className="row ">
            <div className="col-md-12">
              <span style={{ fontWeight: "500", marginRight: "5px" }}>
                Reachability check :{" "}
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
                  {cluster.metadata.modifiedAt ? (
                    <span>{Moment(cluster.metadata.modifiedAt).fromNow()}</span>
                  ) : (
                    <span>Unknown</span>
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-12">
              <span style={{ fontWeight: "500", marginRight: "5px" }}>
                Control plane :{" "}
              </span>
              <span style={{ fontSize: "14px" }}>
                {cluster.spec.clusterData.health === 1 && (
                  <span>
                    <i
                      className="zmdi zmdi-circle zmdi-hc-2x text-success"
                      style={{
                        boxShadow: "rgb(145, 239, 149) 1px 1px 10px 1px",
                        backgroundColor: "#cbffce",
                        fontSize: "smaller",
                        marginRight: "8px",
                        marginLeft: "5px",
                      }}
                    />{" "}
                    HEALTHY
                  </span>
                )}
                {cluster.spec.clusterData.health === 2 && (
                  <span>
                    {cluster.reason ? (
                      <ResourceDialog
                        message={
                          <span>
                            Reason :&nbsp;
                            {cluster.reason}
                          </span>
                        }
                        heading={
                          <span>
                            Status :&nbsp;
                            <span
                              style={{
                                fontWeight: "initial",
                                color: "gray",
                              }}
                            >
                              Unhealthy
                            </span>
                          </span>
                        }
                      >
                        <span style={{ cursor: "pointer" }}>
                          Unhealthy
                          <i
                            className="zmdi zmdi-open-in-new"
                            style={{
                              marginLeft: "5px",
                              color: "teal",
                              fontSize: "medium",
                              position: "absolute",
                              marginTop: "2px",
                            }}
                          />
                        </span>
                      </ResourceDialog>
                    ) : (
                      <span>
                        <i
                          className="zmdi zmdi-circle zmdi-hc-2x text-danger"
                          style={{
                            boxShadow: "rgb(255, 195, 191) 1px 1px 10px 1px",
                            backgroundColor: "#ffe5e5",
                            fontSize: "smaller",
                            marginRight: "8px",
                            marginLeft: "5px",
                          }}
                        />{" "}
                        UNHEALTHY
                      </span>
                    )}
                  </span>
                )}
                {(cluster.spec.clusterData.health === 3 ||
                  !cluster.spec.clusterData.health) && (
                  <span style={{ color: "orange" }}>HEALTH UNKNOWN</span>
                )}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ClusterStatusInfo;
