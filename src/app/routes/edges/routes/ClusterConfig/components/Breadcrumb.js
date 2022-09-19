import React from "react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";

const Breadcrumb = ({ edge }) => {
  if (!edge) return;
  const config = {};
  config.links = [
    {
      label: "Clusters",
      href: "#/app/edges",
    },
    {
      label: `${edge.metadata.name || "..."}`,
      href: `#/app/edges/${edge.id}`,
      current: true,
    },
  ];
  return (
    <div style={{ marginBottom: "20px" }}>
      <ResourceBreadCrumb config={config} />
    </div>
  );
};

export default Breadcrumb;
