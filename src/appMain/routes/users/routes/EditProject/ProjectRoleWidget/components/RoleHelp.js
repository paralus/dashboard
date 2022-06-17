import React from "react";

const RoleHelp = {
  ADMIN: (
    <span className="mb-0">
      <i>
        {"Group users can view and manage all your application and " +
          "infrastructure resources across all projects."}
      </i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {
          "Gives Read/Write access to Users, Groups, Clusters, Roles, Role association & Namespaces"
        }
      </span>
    </span>
  ),
  PROJECT_ADMIN: (
    <span className="mb-0">
      <i>Group users can view and manage all your application resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read/Write access to Clusters, Namespaces"}
      </span>
    </span>
  ),
  PROJECT_READ_ONLY: (
    <span className="mb-0">
      <i>Group users can only view your application resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read-Only access to Clusters, Namespaces"}
      </span>
    </span>
  ),
  NAMESPACE_ADMIN: (
    <span className="mb-0">
      <i>Group users can only can publish workloads in assigned namespaces.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read/Write access to assigned Namespaces
      </span>
    </span>
  ),
  NAMESPACE_READ_ONLY: (
    <span className="mb-0">
      <i>Group users can only view workloads in assigned namespaces.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read Only access to assigned Namespaces
      </span>
    </span>
  ),
  CLUSTER_ADMIN: (
    <span className="mb-0">
      <i>Group users can view and manage all your cluster resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read/Write access to Clusters
      </span>
    </span>
  ),
  ADMIN_READ_ONLY: (
    <span className="mb-0">
      <i>
        Group users can view all your application and infrastructure resources
        across all projects.
      </i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read/Write access to Users, Groups, Clusters, Roles, Role
        association & Namespaces
      </span>
    </span>
  ),
};

export default RoleHelp;
