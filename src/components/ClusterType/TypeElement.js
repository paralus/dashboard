import React from "react";
import { getClusterType } from "./helpers";

const TypeElement = ({ params }) => {
  if (!params) return null;
  const { label, src } = getClusterType(params);
  return (
    <span className="d-inline-flex flex-row align-items-center">
      {src}
      <span style={{ overflowWrap: "break-word" }}>{label}</span>
    </span>
  );
};

export default TypeElement;
