import React, { useContext } from "react";
import { connect } from "react-redux";
import { ClusterViewContext } from "../ClusterViewContexts";

function NodeGroupTab({ edge, providers }) {
  const { c } = useContext(ClusterViewContext);
  return (
    <div className="node-group-tab">
      {React.createElement(c.NodeGroups, { edge, providers })}
    </div>
  );
}

const mapStateToProps = ({ settingsOps }) => {
  return { providers: settingsOps.providers };
};
export default connect(mapStateToProps)(NodeGroupTab);
