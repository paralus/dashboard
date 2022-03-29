import React from "react";
import { RoleTypes } from "constants/RoleTypes";

function RolesInfo({ roles, projectId, addGroupInRole = null }) {
  const getRoleStrings = () => {
    const parsedRoles = roles.map((role) => {
      let roleString = RoleTypes[role];
      if (role.includes("NAMESPACE"))
        roleString += ` [ ${namespacesList.join(", ")} ]`;
      if (addGroupInRole && role.group) roleString += ` [ GROUP: ${role} ]`;
      return roleString;
    });

    return [...new Set(parsedRoles)];
  };

  return getRoleStrings().map((row, index) => <div key={index}>{row}</div>);
}

export default RolesInfo;
