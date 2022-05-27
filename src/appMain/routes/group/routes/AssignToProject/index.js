/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { editGroupWithCallback, getRoles, getGroupDetail } from "actions/index";
import T from "i18n-react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafaySnackbar from "components/RafaySnackbar";
import RafayPageHeader from "components/RafayPageHeader";
import ProjectRoleWidget from "./ProjectRoleWidget";

class AssignToProject extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      groupId: props.match.params.groupId,
      groupName: "",
      selectedProject: null,
      selectedNamespaces: null,
      selectedRoles: null,
    };
  }

  componentDidMount() {
    const { getRoles, getGroupDetail } = this.props;
    const { groupId } = this.state;
    getRoles();
    getGroupDetail(groupId);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupDetail } = props;
    if (groupDetail) {
      newState.groupName = groupDetail.metadata.name;
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
    let project = selectedProject;
    if (project !== "ALL PROJECTS") {
      project = project?.metadata?.name;
    }
    selectedRoles.forEach((role) => {
      if (role.spec.scope == "namespace") {
        selectedNamespaces.forEach((ns) => {
          let r = {
            project: project,
            role: role.metadata.name,
            namespace: ns,
          };
          roles.push(r);
        });
      } else {
        let r = {
          project: project,
          role: role.metadata.name,
          group: groupId,
        };
        roles.push(r);
      }
    });
    return roles;
  };

  handleSaveChanges = () => {
    const { selectedProject, selectedRoles, groupId, selectedNamespaces } =
      this.state;
    const { groupDetail, editGroupWithCallback } = this.props;
    if (selectedProject !== "ALL PROJECTS") {
      if (!selectedProject) {
        this.setState({
          showAlert: true,
          alertMessage: "Please select a project",
        });
        return;
      }
    }
    if (!selectedRoles) {
      this.setState({
        showAlert: true,
        alertMessage: "Please select a role",
      });
      return;
    }
    let invalidNamespace = false;
    selectedRoles.find((r) => {
      if (r.spec.scope == "namespace" && !selectedNamespaces) {
        invalidNamespace = true;
      }
    });
    if (invalidNamespace) {
      this.setState({
        showAlert: true,
        alertMessage: "Please select a namespace",
      });
      return;
    }
    if (!groupDetail.spec.projectNamespaceRoles) {
      groupDetail.spec.projectNamespaceRoles = this.transformRoles();
    } else {
      groupDetail.spec.projectNamespaceRoles.push(...this.transformRoles());
    }
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
    const { groupName, groupId, showAlert, alertMessage, selectedNamespaces } =
      this.state;
    const { drawerType, systemRoles, projectsList, groupDetail } = this.props;
    let filteredProjectsList = projectsList;
    if (
      groupDetail &&
      groupDetail.spec &&
      groupDetail.spec.projectNamespaceRoles
    ) {
      filteredProjectsList.items = projectsList.items.filter(
        (p) =>
          !groupDetail.spec.projectNamespaceRoles.find((gp) => {
            if (gp.project) {
              return gp.project === p.metadata.name;
            }
            return false;
          })
      );
    }
    const hasProjectRole =
      filteredProjectsList &&
      projectsList &&
      projectsList.length !== filteredProjectsList.length;

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
          label: <T.span text="groups.assign_to_project.layout.title" />,
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <RafayPageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="groups.assign_to_project.layout.title"
            help="groups.assign_to_project.layout.helptext"
          />
          <ProjectRoleWidget
            onNamespacesChange={this.handleNamespacesChange}
            onProjectChange={this.handleProjectChange}
            handleRolesChange={this.handleRolesChange}
            systemRoles={systemRoles}
            projectsList={filteredProjectsList}
            editNamespaces={selectedNamespaces}
            hasProjectRole={hasProjectRole}
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
                  className="ml-0 bg-white text-red"
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
          message={alertMessage}
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
    editGroupWithCallback,
    getRoles,
    getGroupDetail,
  })(AssignToProject)
);
