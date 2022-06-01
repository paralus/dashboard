/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getRoles,
  getGroupDetail,
  getProjects,
  editGroupWithCallback,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafaySnackbar from "components/RafaySnackbar";
import RafayPageHeader from "components/RafayPageHeader";
import ProjectRoleWidget from "./ProjectRoleWidget";
import { capitalizeFirstLetter } from "../../../../../utils";

class EditProject extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      groupId: props.match.params.groupId,
      groupName: "",
      selectedProject: null,
      selectedNamespaces: null,
      selectedRoles: null,
      isRoleModified: false,
      editRoles: null,
      projectId: props.match.params.projectId,
    };
  }

  componentDidMount() {
    const { getRoles, getGroupDetail } = this.props;
    const { groupId } = this.state;
    getRoles();
    getGroupDetail(groupId);
    getProjects();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupDetail, projectsList } = props;
    if (groupDetail) {
      newState.groupName = groupDetail.metadata.name;
      if (groupDetail && !state.isRoleModified)
        newState.editRoles = groupDetail.spec.projectNamespaceRoles;
    }
    if (projectsList && !newState.selectedProject) {
      if (newState.projectId === "all") {
        newState.selectedProject = "ALL PROJECTS";
      } else {
        newState.selectedProject = projectsList.items.find(
          (p) => p.metadata.name === newState.projectId
        )?.metadata.name;
      }
    }
    return {
      ...newState,
    };
  }

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  successCallback = () => {
    const { history } = this.props;
    const { groupId } = this.state;
    history.push(`/main/groups/${groupId}`);
  };

  errorCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
    });
  };

  transformRoles = () => {
    const { selectedRoles, selectedProject, groupId, selectedNamespaces } =
      this.state;
    const roles = [];

    selectedRoles.forEach((role) => {
      if (role.spec.scope === "namespace") {
        selectedNamespaces.forEach((ns) => {
          let r = {
            project: selectedProject,
            role: role.metadata.name,
            group: groupId,
            namespace: ns,
          };
          roles.push(r);
        });
      } else {
        let r = {
          project: selectedProject,
          role: role.metadata.name,
          group: groupId,
        };
        roles.push(r);
      }
    });

    const tempNamespaces = [];
    roles.forEach((role) => {
      if (role.namespace && role.namespace !== undefined)
        tempNamespaces.push(role.namespace);
    });
    this.setState({ selectedNamespaces: tempNamespaces });
    return roles;
  };

  handleSaveChanges = () => {
    const { groupDetail, editGroupWithCallback } = this.props;
    const { selectedRoles, selectedNamespaces } = this.state;

    let invalidNamespace = false;
    selectedRoles.find((r) => {
      if (
        r.spec.scope === "namespace" &&
        (!selectedNamespaces || selectedNamespaces.length < 1)
      )
        invalidNamespace = true;
    });
    if (invalidNamespace) {
      this.setState({
        showAlert: true,
        alertMessage: "Please select a namespace",
      });
      return;
    }
    groupDetail.spec.projectNamespaceRoles = this.transformRoles();
    editGroupWithCallback(
      groupDetail,
      this.successCallback,
      this.errorCallback
    );
  };

  handleProjectChange = (project) => {
    this.setState({ selectedProject: project });
  };

  handleNamespacesChange = (namespaces) => {
    this.setState({ selectedNamespaces: namespaces });
  };

  handleRolesChange = (checked) => {
    this.setState({ selectedRoles: checked });
  };

  render() {
    const {
      groupName,
      groupId,
      showAlert,
      alertMessage,
      selectedProject,
      editRoles,
      selectedNamespaces,
    } = this.state;
    const { drawerType, systemRoles, projectsList } = this.props;

    let breadcrumbLabel = "";
    if (selectedProject) {
      breadcrumbLabel =
        selectedProject === "ALL PROJECTS" ? "ALL PROJECTS" : selectedProject;
    }

    const config = {
      links: [
        {
          label: `Groups`,
          href: "#/main/groups",
        },
        {
          label: `${groupName}`,
          href: `#/main/groups/${groupId}`,
        },
        {
          label: breadcrumbLabel,
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <RafayPageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="groups.edit_project.layout.title"
            help="groups.edit_project.layout.helptext"
          />
          <ProjectRoleWidget
            onNamespacesChange={this.handleNamespacesChange}
            onProjectChange={this.handleProjectChange}
            handleRolesChange={this.handleRolesChange}
            systemRoles={systemRoles}
            projectsList={projectsList}
            editProject={selectedProject}
            editNamespaces={selectedNamespaces}
            editRoles={editRoles}
          />
        </div>
        <Paper
          elevation={3}
          className="workload-detail-bottom-navigation"
          style={{ left: "26px" }}
        >
          <div className="row d-flex justify-content-between pt-3">
            <div className="d-flex flex-row">
              <div className="d-flex align-items-center">
                <Button
                  className="ml-4 bg-white text-red"
                  variant="contained"
                  color="default"
                  onClick={this.successCallback}
                  type="submit"
                >
                  Discard Changes &amp; Exit
                </Button>
              </div>
            </div>
            <div className="next d-flex align-items-center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSaveChanges}
                type="submit"
              >
                <span>Save &amp; Exit</span>
              </Button>
            </div>
          </div>
        </Paper>
        <RafaySnackbar
          open={showAlert}
          severity="error"
          message={capitalizeFirstLetter(alertMessage)}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

const mapStateToProps = ({ settings, Projects, Groups }) => {
  const { drawerType } = settings;
  const { groupDetail } = Groups;
  const systemRoles = settings.roles.list;
  const projectsList = Projects.projectsList;
  return {
    drawerType,
    systemRoles,
    projectsList,
    groupDetail,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getRoles,
    getGroupDetail,
    getProjects,
    editGroupWithCallback,
  })(EditProject)
);
