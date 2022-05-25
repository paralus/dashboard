import React, { useState, useEffect } from "react";
import { RoleTypes } from "constants/RoleTypes";

function RolesInfo({
  roles,
  projectId,
  addGroupInRole = null,
  namespaceNames = [],
}) {
  const [namespacesList, setNamespacesList] = useState(namespaceNames);

  const getNamespaceNames = () => {
    if (!roles?.length) return [];

    const selectedNamespaces = roles?.reduce((acc, curr) => {
      const { role, namespace_id } = curr;
      if (role?.name?.includes("NAMESPACE") && namespace_id) {
        const namespace = thisProjectNamespaces?.find(
          (pn) => pn.metadata?.id === namespace_id
        );
        if (namespace) acc.push(namespace.metadata.name);
      }
      return acc;
    }, []);
    const uniqueNamespace = [...new Set(selectedNamespaces)];
    return uniqueNamespace;
  };

  useEffect(() => {
    const dataRoles = roles?.map((r) => r?.role?.name);
    const uniqueDataRoles = [...new Set(dataRoles)];
    const isNamespaceRole = uniqueDataRoles?.join().includes("NAMESPACE");

    if (isNamespaceRole) setNamespacesList(getNamespaceNames());
  }, [roles]);

  const getRoleStrings = () => {
    const parsedRoles = roles.map((role) => {
      let roleString = RoleTypes[role];
      if (roleString === undefined) {
        roleString = role;
      }
      if (role.includes("NAMESPACE") || namespacesList.length > 0)
        roleString += ` [ ${namespacesList.join(", ")} ]`;
      if (addGroupInRole && role.group) roleString += ` [ GROUP: ${role} ]`;
      return roleString;
    });

    return [...new Set(parsedRoles)];
  };

  return getRoleStrings().map((row, index) => <div key={index}>{row}</div>);
}

export default RolesInfo;
