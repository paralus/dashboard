import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getProject } from "actions/index";

import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafayTabLayout from "components/RafayTabLayout";
import AssignedUsers from "./AssignedUsers";
import AssignedGroups from "./AssignedGroups";
import General from "./General";

class ProjectDetail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectId: props.match.params.projectId,
      projectName: "",
    };
  }

  componentDidMount() {
    const { getProject, match } = this.props;
    getProject(match.params.projectId);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { projectDetail } = props;
    if (projectDetail) {
      newState.projectName = projectDetail.metadata.name;
    }
    return {
      ...newState,
    };
  }

  render() {
    const { projectName } = this.state;
    const { projectDetail } = this.props;

    const config = {
      links: [
        {
          label: `Home`,
          href: "#/main",
        },
        {
          label: `Project Settings`,
          current: true,
        },
        {
          label: `${projectName}`,
          current: true,
        },
      ],
    };
    return (
      <RafayTabLayout
        // title={projectName}
        breadcrumb={<ResourceBreadCrumb config={config} />}
        help="projects.project_detail.layout.helptext"
        tabs={[
          { label: "General", panel: <General project={projectDetail} /> },
          { label: "Assigned Groups", panel: <AssignedGroups /> },
          { label: "Assigned Users", panel: <AssignedUsers /> },
        ]}
      />
    );
  }
}

const mapStateToProps = ({ Projects }) => {
  const { projectDetail } = Projects;
  return {
    projectDetail,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getProject,
  })(ProjectDetail)
);
