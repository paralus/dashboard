import { Grid, makeStyles, Box, Button } from "@material-ui/core";
import * as R from "ramda";
import React, { useState, useContext, useEffect } from "react";

import { applyFormatter, isSomething } from "utils";
import { useSelector } from "react-redux";
import MetaItem from "./MetaItem";
import NodeLabelEditor from "./NodeLabelEditor";
import NodeTaintEditor from "./NodeTaintEditor";
import { ClusterViewContext } from "../ClusterViewContexts";
import LabelItem from "./LabelTaintItem";
import IfThen from "./IfThen";

const useStyles = makeStyles(() => ({
  labelFlex: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
    alignContent: "space-between",
    "& > span": {
      margin: "0 12px 12px 0"
    }
  }
}));

function clusterHealthInfo(edgeHealth, nodeName) {
  let clusterHealth = {};
  if (edgeHealth && edgeHealth[0]) {
    clusterHealth = edgeHealth[0].nodesStatusMessage.nodesStatus.find(
      x => x.name === nodeName
    );
  }
  return { clusterHealth };
}

export default function NodeMeta({ node, edgeHealth }) {
  const classes = useStyles();
  const [openLabelEditor, setOpenLabelEditor] = useState(false);
  const [openTaintEditor, setOpenTaintEditor] = useState(false);
  const { a, edge } = useContext(ClusterViewContext);
  const [loading, setLoading] = useState(false);
  const [cluster, setCluster] = useState({});
  const [refresh, setRefresh] = useState(false);
  const currentProject = useSelector(state => state.Projects.currentProject);

  const nodeName = node?.hostname?.toLowerCase() || node.name;

  const { clusterHealth = {} } = clusterHealthInfo(edgeHealth, nodeName);

  useEffect(() => {
    setLoading(true);
    a.getV2Cluster(currentProject.id, edge.name)
      .then(res => {
        setCluster(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [refresh]);

  const nodeObject =
    cluster?.status?.nodes.find(x => x.metadata.name === nodeName) || {};

  const nodeLabelObject = nodeObject?.metadata?.labels || {};
  const nodeLabels = Object.entries(nodeLabelObject).map(x => ({
    key: x[0],
    value: x[1]
  }));

  const nodeTaints = nodeObject?.spec?.taints || [];
  const ROLE_KEY = "node-role.kubernetes.io";

  const parseNodeRoles = () => {
    const isDedicatedMaster = nodeTaints.some(
      t => t.effect === "NoSchedule" && t.key === `${ROLE_KEY}/master`
    );

    const nodeRoles = nodeLabels.reduce((list, label) => {
      if (label.key.includes(ROLE_KEY)) {
        let role = label.key.split("/")[1];
        if (role === "master" && isDedicatedMaster) role = `Dedicated ${role}`;
        if (role) list.push(role.toUpperCase());
      }
      return list;
    }, []);

    if (nodeRoles?.length === 0) return null;
    return nodeRoles.map(role => <div>{role}</div>);
  };

  const renderItems = (items, label) => {
    const openEditor =
      label === "Labels" ? setOpenLabelEditor : setOpenTaintEditor;
    return (
      <>
        {items.length === 0 && `No ${label}`}
        <Box className={classes.labelFlex}>
          {items.map(item => (
            <LabelItem key={item.key} item={item} />
          ))}
        </Box>
        <Box>
          <Button
            variant="contained"
            dense
            size="small"
            color="primary"
            onClick={() => openEditor(true)}
          >
            {items.length === 0 ? "Add" : "Edit"} {label}
          </Button>
        </Box>
      </>
    );
  };

  const nodeRoles = parseNodeRoles();

  return (
    <Box p={1 / 2}>
      <Grid container spacing={1}>
        <MetaItem label="Internal IP" value={node.private_ip} />
        <IfThen condition={edge.cluster_type === "manual" && nodeRoles}>
          <MetaItem label="Roles" value={nodeRoles} />
        </IfThen>
        <IfThen condition={edge.cluster_type !== "manual"}>
          <MetaItem
            label="Roles"
            value={R.pipe(
              R.propOr([], "roles"),
              R.filter(r => r === "Proxy" || r === "Storage"),
              R.map(role => {
                if (role === "Proxy") return "Internet Facing";
                return `${role} (${node.storage_device_loc})`;
              }),
              R.join(", ")
            )(node)}
          />
        </IfThen>
        <MetaItem
          label="CPU"
          value={R.when(
            isSomething,
            R.pipe(
              R.divide(R.__, 1000),
              applyFormatter("0.00a"),
              cpu => `${cpu} cores`
            ),
            node.num_cores
          )}
        />
        <MetaItem
          label="Memory"
          value={R.when(
            isSomething,
            R.pipe(R.multiply(1000), applyFormatter("0.0 B")),
            node.total_memory
          )}
        />
        <MetaItem label="GPU" value={node.num_gpus} />
        <MetaItem
          label="Container Runtime Version"
          value={clusterHealth.container_runtime_version}
        />
        <MetaItem
          label="Kubelet Version"
          value={clusterHealth.kubelet_version}
        />
        <MetaItem label="Kernel Version" value={clusterHealth.kernel_version} />
        <MetaItem label="OS Image" value={clusterHealth.os_image} />
        <MetaItem
          alignItems="flex-start"
          label="Labels"
          value={loading ? "...Loading" : renderItems(nodeLabels, "Labels")}
        />
        <MetaItem
          alignItems="flex-start"
          label="Taints"
          value={loading ? "...Loading" : renderItems(nodeTaints, "Taints")}
        />

        <NodeLabelEditor
          isOpen={openLabelEditor}
          onOpen={setOpenLabelEditor}
          node={nodeObject}
          onRefresh={setRefresh}
        />

        <NodeTaintEditor
          isOpen={openTaintEditor}
          onOpen={setOpenTaintEditor}
          node={nodeObject}
          onRefresh={setRefresh}
        />
      </Grid>
    </Box>
  );
}
