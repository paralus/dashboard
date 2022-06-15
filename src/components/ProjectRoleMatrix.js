import React from "react";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from "@material-ui/core";

const manageNamespaces = (namespaceArray) => {
  let namespaces = `[ `;
  namespaces += namespaceArray.join(",");
  namespaces += `]`;
  return namespaces;
};

const formatProjectRoles = (roles) => {
  const output = {};
  (roles || []).forEach((item) => {
    const nsarray = [item?.namespace];
    if (!output[item?.project]) {
      if (["ADMIN", "ADMIN_READ_ONLY"].includes(item?.role)) {
        output["All Projects"] = {
          [item?.group || "-"]: {
            roles: [item.role],
            NS: nsarray,
          },
        };
      } else {
        output[item?.project] = {
          [item?.group || "-"]: {
            roles: item?.role && [item.role],
            NS: nsarray,
          },
        };
      }
    } else if (!output[item?.project][item.group]) {
      if (["ADMIN", "ADMIN_READ_ONLY"].includes(item?.role) && !item.project) {
        const referenceObj = output["All Projects"];

        if (item?.group)
          if (
            Array.isArray(referenceObj.groups) &&
            !referenceObj.groups.includes(item.group)
          )
            referenceObj.groups.push(item.group);
          else referenceObj.groups = [item.group];
        if (nsarray && Array.isArray(referenceObj?.NS))
          referenceObj?.NS.push(nsarray);
        else referenceObj.NS = nsarray;

        output["All Projects"][item.group] = { ...referenceObj };
      } else {
        output[item.project][item.group] = {
          roles: item?.role && [item.role],
          NS: nsarray,
        };
      }
    } else {
      const referenceObj = output[item?.project][item?.group];

      if (item.role)
        if (
          Array.isArray(referenceObj.roles) &&
          !referenceObj.roles.includes(item.role)
        )
          referenceObj.roles.push(item.role);
        else referenceObj.roles = [item.role];

      if (nsarray && Array.isArray(referenceObj?.NS))
        referenceObj?.NS.push(nsarray);
      else referenceObj.NS = nsarray;

      output[item?.project][item?.group] = { ...referenceObj };
    }
  });

  return output;
};

const getRoleProjectRowList = (role, config, clx) => (
  <>
    <TableCell className="section-item role">{role}</TableCell>
    <TableCell className="section-item">
      {config?.roles?.length > 0 ? (
        <ul className="m-0">
          {config.roles.map((role, roleidx) => (
            <li key={roleidx}>
              {role === "ADMIN_READ_ONLY" ? "ORGANIZATION READ ONLY" : role}
            </li>
          ))}
        </ul>
      ) : (
        <span className="no-result-list">-</span>
      )}
    </TableCell>
    <TableCell className="section-item">
      {config && config.NS && config.NS.length > 0 ? (
        <span className="no-result-list">{manageNamespaces(config.NS)}</span>
      ) : (
        <span className="no-result-list">-</span>
      )}
    </TableCell>
  </>
);

const ProjectRoleMatrix = ({ roles }) => {
  const projectMatrix = formatProjectRoles(roles);

  return (
    <div className="user-list-container">
      {Object.keys(projectMatrix).length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="section-title">Project</TableCell>
              <TableCell className="section-title">Group</TableCell>
              <TableCell className="section-title">Role</TableCell>
              <TableCell className="section-title">Namespace</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(projectMatrix)?.map((project, projectidx) =>
              Object.keys(projectMatrix[project]).map((group, groupidx) =>
                groupidx === 0 ? (
                  <TableRow className="m-0" key={`${groupidx}${projectidx}`}>
                    <TableCell
                      className="section-main-item"
                      rowSpan={Object.keys(projectMatrix[project])?.length}
                    >
                      {project}
                    </TableCell>
                    {getRoleProjectRowList(
                      group,
                      projectMatrix[project][group]
                    )}
                  </TableRow>
                ) : (
                  <TableRow key={`${groupidx}${projectidx}`}>
                    {getRoleProjectRowList(
                      group,
                      projectMatrix[project][group]
                    )}
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="section-no-item">No assigned projects</div>
      )}
    </div>
  );
};

export default ProjectRoleMatrix;
