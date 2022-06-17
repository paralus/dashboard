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
        {"Gives Read/Write access to Workloads, Namespaces, " +
          "Registries, Endpoints, Clusters, Blueprints and Add-ons"}
      </span>
    </span>
  ),

  PROJECT_ADMIN: (
    <span className="mb-0">
      <i>Group users can view and manage all your application resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read/Write access to Workloads, Namespaces, " +
          "Certificates, Registries, Secret Stores and Endpoints"}
      </span>
    </span>
  ),
  PROJECT_READ_ONLY: (
    <span className="mb-0">
      <i>Group users can only view your application resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read-Only access to Workloads, Namespaces, " +
          "Certificates, Registries, Secret Stores and Endpoints"}
      </span>
    </span>
  ),
  INFRA_ADMIN: (
    <span className="mb-0">
      <i>Group users can view and manage all your Infrastructure resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read/Write access to Clusters, Namespaces, Blueprints, Add-ons, " +
          "and Cloud Credentials"}
      </span>
    </span>
  ),
  INFRA_READ_ONLY: (
    <span className="mb-0">
      <i>Group users can only view your Infrastructure resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read-Only access to Clusters, Namespaces, Blueprints, Add-ons, " +
          "and Cloud Credentials"}
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
        Gives Read Only access to Workloads, Namespaces, Registries, Endpoints,
        Clusters, Blueprints and Add-ons
      </span>
    </span>
  ),
};

export default RoleHelp;
