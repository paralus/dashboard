import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ClusterViewContext } from "../ClusterViewContexts";

function NodePoolTab({ edge }) {
  const { c } = useContext(ClusterViewContext);
  const { providers } = useSelector(state => state.settingsOps);
  return (
    <div className="node-pool-tab">
      {React.createElement(c.NodePoolsSettings, { edge, providers })}
    </div>
  );
}

export default NodePoolTab;
