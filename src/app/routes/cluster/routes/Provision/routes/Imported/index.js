import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getEdgeData } from "actions/index";
import AutoRefresh from "components/AutoRefresh";

import ClusterConfigDownload from "./components/ClusterConfigDownload";
import ClusterHeaderImported from "./components/ClusterHeaderImported";
import ClusterStatus from "./components/ClusterStatus";
import BreadCrumb from "./components/BreadCrumb";
import Footer from "./components/Footer";

const Imported = () => {
  const params = useParams();
  const [edge, setEdge] = useState(null);
  const [edgeName, setEdgeName] = useState(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(3);
  const currentProject = useSelector((state) => state.Projects?.currentProject);
  const taskPoller = useRef(null);
  const history = useHistory();

  const fetchClusterDetail = (_) => {
    getEdgeData(params.cluster)
      .then((res) => {
        const tEdge = res?.data;
        if (!edgeName) {
          setEdgeName(tEdge.metadata.name);
        }
        setEdge(tEdge);
      })
      .catch((err) => console.error("Error Imported : ", err));
  };

  const initTaskPoller = (_) => {
    fetchClusterDetail();
    if (!taskPoller.current) {
      taskPoller.current = setInterval(
        (_) => fetchClusterDetail(),
        autoRefreshInterval * 1000
      );
    }
  };

  useEffect((_) => {
    initTaskPoller();
    return () => {
      clearInterval(taskPoller.current);
    };
  }, []);

  useEffect(
    (_) => {
      if (taskPoller.current) {
        clearInterval(taskPoller.current);
        taskPoller.current = null;
        initTaskPoller();
      }
    },
    [autoRefreshInterval]
  );

  if (!edge) return null;

  const clusterStatus = {
    ClusterRegister: "Pending",
    ClusterCheckIn: "Pending",
    ClusterReady: "Pending",
    reasons: {},
  };

  if (edge.spec.clusterData?.cluster_status?.conditions) {
    for (
      let index = 0;
      index < edge.spec.clusterData.cluster_status.conditions.length;
      index++
    ) {
      const condition = edge.spec.clusterData.cluster_status.conditions[index];
      if (
        condition.status === undefined ||
        ["NotSet", "Retry"].includes(condition.status)
      ) {
        condition.status = "Pending";
      }
      if (condition.status === "Failed") {
        clusterStatus.reasons[condition.type] = condition.reason;
      }
      clusterStatus[condition.type] = condition.status;
    }
  }

  const isClusterRegistered = clusterStatus.ClusterRegister === "Success";

  const handleExit = (_) => history.push(`/app/edges/${edge.metadata.name}`);

  return (
    <div className="m-3">
      <div className="d-flex justify-content-between">
        <BreadCrumb edge={edge} />
        <AutoRefresh
          autoRefreshInterval={autoRefreshInterval}
          setAutoRefreshInterval={setAutoRefreshInterval}
        />
      </div>
      <div className="mt-2">
        <ClusterHeaderImported
          edge={edge}
          status={clusterStatus}
          refreshEdge={(_) => {
            fetchClusterDetail();
          }}
        />
      </div>
      <ClusterStatus clusterStatus={clusterStatus} />
      <div className="mb-2">
        <ClusterConfigDownload edge={edge} clusterStatus={clusterStatus} />
      </div>
      <Footer name={edge.metadata.name} />
    </div>
  );
};

export default Imported;
