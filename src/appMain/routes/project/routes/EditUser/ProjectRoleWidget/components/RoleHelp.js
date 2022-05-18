import React from "react";

const RoleHelp = {
  ADMIN: (
    <span className="mb-0">
      <i>
        {"User can view and manage all your application and " +
          "infrastructure resources across all projects."}
      </i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read/Write access to Workloads, Namespaces, " +
          "Registries, Endpoints, Clusters, Blueprints and Add-ons"}
      </span>
    </span>
  ),

  ADMIN_READ_ONLY: (
    <span className="mb-0">
      <i>
        User can view all your application and infrastructure resources across
        all projects.
      </i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read Only access to Workloads, Namespaces, Registries, Endpoints,
        Clusters, Blueprints and Add-ons
      </span>
    </span>
  ),

  PROJECT_ADMIN: (
    <span className="mb-0">
      <i>User can view and manage all your application resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read/Write access to Workloads, Namespaces, " +
          "Certificates, Registries, Secret Stores and Endpoints"}
      </span>
    </span>
  ),
  PROJECT_READ_ONLY: (
    <span className="mb-0">
      <i>User can only view your application resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read-Only access to Workloads, Namespaces, " +
          "Certificates, Registries, Secret Stores and Endpoints"}
      </span>
    </span>
  ),
  INFRA_ADMIN: (
    <span className="mb-0">
      <i>User can view and manage all your Infrastructure resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read/Write access to Clusters, Namespaces, Blueprints, Add-ons, " +
          "and Cloud Credentials"}
      </span>
    </span>
  ),
  INFRA_READ_ONLY: (
    <span className="mb-0">
      <i>User can only view your Infrastructure resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        {"Gives Read-Only access to Clusters, Namespaces, Blueprints, Add-ons, " +
          "and Cloud Credentials"}
      </span>
    </span>
  ),
  NAMESPACE_ADMIN: (
    <span className="mb-0">
      <i>User can only can publish workloads in assiged namespaces.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read/Write access to k8s resources in Namespace
      </span>
    </span>
  ),
  NAMESPACE_READ_ONLY: (
    <span className="mb-0">
      <i>User can only view workloads in assigned namespaces.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read-Only access to k8s resources in Namespace
      </span>
    </span>
  ),
  CLUSTER_ADMIN: (
    <span className="mb-0">
      <i>User can view and manage all your cluster resources.</i>
      <br />
      <span style={{ color: "dodgerblue", fontSize: "12px" }}>
        Gives Read/Write access to Clusters
      </span>
    </span>
  ),
};

export default RoleHelp;
