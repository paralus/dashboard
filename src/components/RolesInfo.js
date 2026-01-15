import React, { useState, useEffect } from "react";
import { RoleTypes } from "constants/RoleTypes";

function RolesInfo({ projectId, addGroupInRole = null, roleInfo = [] }) {
  const [namespacesList, setNamespacesList] = useState([]);

  const getNamespaceNames = () => {
    if (!roleInfo?.length) return [];

    const selectedNamespaces = roleInfo?.reduce((acc, curr) => {
      const { roleName, namespace_id } = curr;
      if (roleName.includes("NAMESPACE") && namespace_id) {
        const namespace = thisProjectNamespaces?.find(
          (pn) => pn.metadata?.id === namespace_id,
        );
        if (namespace) acc.push(namespace.metadata.name);
      }
      return acc;
    }, []);
    const uniqueNamespace = [...new Set(selectedNamespaces)];
    return uniqueNamespace;
  };

  useEffect(() => {
    const dataRoles = roleInfo?.map((r) => r?.roleName);
    const uniqueDataRoles = [...new Set(dataRoles)];
    const isNamespaceRole = uniqueDataRoles?.join().includes("NAMESPACE");

    if (isNamespaceRole) setNamespacesList(getNamespaceNames());
  }, [roleInfo]);

  const getRoleStrings = () => {
    const parsedRoles = roleInfo.map((role) => {
      let roleString = RoleTypes[role];
      if (roleString === undefined) {
        roleString = role.roleName;
      }
      roleString += ` [ ${role.namespaces.join(", ")} ]`;
      if (addGroupInRole && role.group) roleString += ` [ GROUP: ${role} ]`;
      return roleString;
    });

    return [...new Set(parsedRoles)];
  };

  return getRoleStrings().map((row, index) => <div key={index}>{row}</div>);
}

export default RolesInfo;
