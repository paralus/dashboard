import React from "react";
import OldType from "./OldType";
import TypeElement from "./TypeElement";

const ClusterType = ({ type, params }) => {
  if (!params || !params.provisionType) return <OldType type={type} />;
  return <TypeElement params={params} />;
};

export default ClusterType;
