import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getGroupDetail } from "actions";
import ProjectList from "components/ProjectList";

const GroupRoles = (props) => {
  const { groupId, groupData } = props;
  const groupRoles = [];
  if (groupData) {
    if (
      groupData.metadata.name === groupId &&
      groupData.spec.projectNamespaceRoles
    ) {
      for (
        let index = 0;
        index < groupData.spec.projectNamespaceRoles.length;
        index++
      ) {
        const pnr = groupData.spec.projectNamespaceRoles[index];
        const found = groupRoles.find(
          (e) => e.project === pnr.project && e.role === pnr.role
        );
        if (!found) groupRoles.push(pnr);
      }
    }
  }

  return (
    <div>
      <ProjectList roles={groupRoles} />
    </div>
  );
};

const mapStateToProps = ({ Groups }) => {
  const { groupDetail } = Groups;
  return { groupDetail };
};

export default connect(mapStateToProps, {
  getGroupDetail,
})(GroupRoles);
