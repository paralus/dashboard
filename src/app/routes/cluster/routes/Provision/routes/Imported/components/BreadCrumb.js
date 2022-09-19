import React from "react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";

const BreadCrumb = ({ edge }) => {
  return (
    <div>
      <ResourceBreadCrumb
        config={{
          links: [
            {
              label: `Clusters`,
              href: "#/app/edges",
            },
            {
              label: `${edge?.metadata.name || ""}`,
            },
            {
              label: "Provision",
              current: true,
            },
          ],
        }}
      />
    </div>
  );
};

export default BreadCrumb;
