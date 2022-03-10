import React, { useState, useContext, useEffect } from "react";
import { makeStyles, Box, Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import NodeLabelEditor from "./NodeLabelEditor";
import NodeTaintEditor from "./NodeTaintEditor";
import { ClusterViewContext } from "../ClusterViewContexts";
import LabelItem from "./LabelTaintItem";

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

function NodeLabelTaints({ node }) {
  const classes = useStyles();
  const [openLabelEditor, setOpenLabelEditor] = useState(false);
  const [openTaintEditor, setOpenTaintEditor] = useState(false);
  const { a, edge } = useContext(ClusterViewContext);
  const [loading, setLoading] = useState(false);
  const [cluster, setCluster] = useState({});
  const [refresh, setRefresh] = useState(false);
  const currentProject = useSelector(state => state.Projects.currentProject);

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

  const nodeName = node?.hostname?.toLowerCase() || node.name;
  const nodeObject =
    cluster?.status?.nodes?.find(x => x.metadata.name === nodeName) || {};

  if (!nodeObject) return null;

  const nodeLabelObject = nodeObject?.metadata?.labels || {};
  const nodeLabels = Object.entries(nodeLabelObject).map(x => ({
    key: x[0],
    value: x[1]
  }));

  const nodeTaints = nodeObject?.spec?.taints || [];

  const renderItems = (items, label) => {
    const openEditor =
      label === "Labels" ? setOpenLabelEditor : setOpenTaintEditor;
    return (
      <>
        <Box className={classes.labelFlex}>
          {items.length > 0
            ? items.map(item => <LabelItem key={item.key} item={item} />)
            : `No ${label}`}
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

  return (
    <div className="row w-100">
      <div className="col-12 h4 font-weight-bold my-2">Labels</div>
      <div className="col-12 mb-2">
        {loading ? "...Loading" : renderItems(nodeLabels, "Labels")}
      </div>
      <div className="col-12 h4 font-weight-bold my-2">Taints</div>
      <div className="col-12 mb-2">
        {loading ? "...Loading" : renderItems(nodeTaints, "Taints")}
      </div>

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
    </div>
  );
}

export default NodeLabelTaints;
