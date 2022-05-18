import React from "react";
import { RoleTypes } from "constants/RoleTypes";
import { Button, Tooltip } from "@material-ui/core";

const formatProjects = (roles, group) => {
  const projects = [];
  const allProjects = [];
  if (roles.length === 0) {
    return [<i key="0">No Projects assigned</i>];
  }
  const tempProjects = {};
  const RoleLabel = ({ name }) => (
    <Button
      disableRipple
      style={{
        backgroundColor: "#ff9800",
        fontWeight: 500,
        fontSize: "75%",
        padding: "3px 8px",
        color: "white",
        marginLeft: "5px",
        verticalAlign: "baseline",
      }}
    >
      {` Role: ${RoleTypes[name]}`}
    </Button>
  );
  const GroupLabel = ({ name }) => (
    <Tooltip title="Role inherited from Group">
      <Button
        disableRipple
        style={{
          backgroundColor: "#00bcd4",
          fontWeight: 500,
          fontSize: "75%",
          padding: "3px 8px",
          color: "white",
          marginLeft: "5px",
          verticalAlign: "baseline",
        }}
      >
        {` Group: ${name}`}
      </Button>
    </Tooltip>
  );

  const NoGroupLabel = (_) => (
    <Tooltip title="User directly assigned to Project">
      <Button
        disableRipple
        style={{
          backgroundColor: "#00bcd4",
          fontWeight: 500,
          fontSize: "75%",
          padding: "3px 8px",
          color: "black",
          marginLeft: "5px",
          verticalAlign: "baseline",
        }}
      >
        N/A
      </Button>
    </Tooltip>
  );

  roles.forEach((r, i) => {
    if (["ADMIN", "ADMIN_READ_ONLY"].includes(r.role.name)) {
      if (r.group) {
        allProjects.push(
          <div key={`arow-${i}`} className="d-flex flex-row mb-2">
            <div className="mr-2">
              <b>ALL PROJECTS</b>
            </div>
            <RoleLabel name={r.role.name} />
            {!group && <GroupLabel name={r.group.name} />}
          </div>
        );
      }
      // else {
      //   allProjects.push(
      //     <div key={`arow-${i}`} className="d-flex flex-row mb-2">
      //       <div className="mr-2">
      //         <b>ALL PROJECTS</b>
      //       </div>
      //       <RoleLabel name={r.role.name} />
      //       {!group && <NoGroupLabel />}
      //     </div>
      //   );
      // }
    } else if (r.project) {
      if (tempProjects[r.project.id]) {
        if (r.group) {
          tempProjects[r.project.id].roles.push({
            name: r.project.name,
            role: r.role.name,
            group: r.group.name,
            namespace_id: r.namespace_id,
          });
        } else {
          tempProjects[r.project.id].roles.push({
            name: r.project.name,
            role: r.role.name,
            namespace_id: r.namespace_id,
          });
        }
      } else if (r.group) {
        tempProjects[r.project.id] = {
          roles: [
            {
              name: r.project.name,
              role: r.role.name,
              group: r.group.name,
              namespace_id: r.namespace_id,
            },
          ],
        };
      } else {
        tempProjects[r.project.id] = {
          roles: [
            {
              name: r.project.name,
              role: r.role.name,
              namespace_id: r.namespace_id,
            },
          ],
        };
      }
    }
  });
  if (allProjects.length > 0) return allProjects;
  Object.keys(tempProjects).forEach((p, j) => {
    tempProjects[p].roles.forEach((r, i) => {
      if (r.group) {
        projects.push(
          <div key={`row-${i}-${j}`} className="d-flex flex-row mb-2">
            <div className="mr-2">{r.name}</div>
            <RoleLabel name={r.role} />
            {!group && <GroupLabel name={r.group} />}
          </div>
        );
      } else {
        projects.push(
          <div key={`row-${i}-${j}`} className="d-flex flex-row mb-2">
            <div className="mr-2">{r.name}</div>
            <RoleLabel name={r.role} />
            {!group && <NoGroupLabel />}
          </div>
        );
      }
    });
  });
  return projects;
};

const ProjectGroupRoles = ({ roles, group }) => {
  return <div className="mt-2">{formatProjects(roles, group)}</div>;
};

export default ProjectGroupRoles;
