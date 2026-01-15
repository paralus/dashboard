/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getRoles,
  getUserDetail,
  editUserWithCallback,
  getProjects,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import AppSnackbar from "components/AppSnackbar";
import PageHeader from "components/PageHeader";
import ProjectRoleWidget from "./ProjectRoleWidget";
import { capitalizeFirstLetter } from "../../../../../utils";

class EditProject extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      projectId: props.match.params.projectId,
      userId: props.match.params.userId,
      username: "",
      selectedProject: null,
      selectedRoles: null,
      isRoleModified: false,
      editRoles: null,
      selectedNamespaces: null,
    };
  }

  componentDidMount() {
    const { getRoles, getUserDetail } = this.props;
    const { userId } = this.state;
    getRoles();
    getUserDetail(userId);
    getProjects();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { userDetail, projectsList, isEdit } = props;
    if (userDetail && !state.isRoleModified) {
      newState.username = userDetail.metadata.name;
      newState.editRoles = userDetail.spec.projectNamespaceRoles;
    }
    if (projectsList && !newState.selectedProject) {
      if (newState.projectId === "all") {
        newState.selectedProject = "ALL PROJECTS";
      } else {
        newState.selectedProject = projectsList.items.find(
          (p) => p.metadata.name === newState.projectId,
        ).metadata.name;
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
    const { userId } = this.state;
    history.push(`/main/users/${userId}`);
  };

  errorCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
    });
  };

  transformRoles = () => {
    const { selectedRoles, selectedProject, selectedNamespaces } = this.state;
    const { userDetail } = this.props;

    const roles = userDetail.spec.projectNamespaceRoles.filter(
      (e) => e.project !== selectedProject,
    );
    const ifAllProjectsSelected = roles.filter(
      (e) =>
        e.group &&
        e.group !== "" &&
        e.role &&
        e.role !== "" &&
        (e.role === "ADMIN" || e.role === "ADMIN_READ_ONLY") &&
        e.project === undefined,
    );

    selectedRoles.forEach((role) => {
      if (role.spec.scope === "namespace") {
        selectedNamespaces.forEach((ns) => {
          let r = {
            project: selectedProject,
            role: role.metadata.name,
            namespace: ns,
          };
          roles.push(r);
        });
      } else if (
        ifAllProjectsSelected.length < 1 ||
        (role.metadata.name !== "ADMIN" &&
          role.metadata.name !== "ADMIN_READ_ONLY")
      ) {
        let r = {
          project: selectedProject,
          role: role.metadata.name,
        };
        roles.push(r);
      }
    });

    let tempNamespaces = [];
    roles.forEach((role) => {
      if (role.namespace && role.namespace !== undefined)
        tempNamespaces.push(role.namespace);
    });
    this.setState({ selectedNamespaces: tempNamespaces });
    return roles;
  };

  handleSaveChanges = () => {
    const { editUserWithCallback, userDetail } = this.props;
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
    userDetail.spec.projectNamespaceRoles = this.transformRoles();
    editUserWithCallback(userDetail, this.successCallback, this.errorCallback);
  };

  handleProjectChange = (project) => {
    this.setState({ selectedProject: project });
  };

  handleRolesChange = (checked) => {
    this.setState({ isRoleModified: true, selectedRoles: checked });
  };

  setSelectedRoles = (checked) => {
    this.setState({ selectedRoles: checked });
  };

  handleNamespacesChange = (namespaces) => {
    this.setState({ selectedNamespaces: namespaces });
  };

  render() {
    const {
      username,
      userId,
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
        selectedProject === "ALL PROJECTS"
          ? "ALL PROJECTS"
          : selectedProject.name;
    }

    const config = {
      links: [
        {
          label: `Users`,
          href: "#/main/users",
        },
        {
          label: `${username}`,
          href: `#/main/users/${userId}`,
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
          <PageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="users.edit_project.layout.title"
            help="users.edit_project.layout.helptext"
          />
          <ProjectRoleWidget
            onProjectChange={this.handleProjectChange}
            handleRolesChange={this.handleRolesChange}
            onNamespacesChange={this.handleNamespacesChange}
            systemRoles={systemRoles}
            projectsList={projectsList}
            editProject={selectedProject}
            editRoles={editRoles}
            editNamespaces={selectedNamespaces}
            setSelectedRoles={this.setSelectedRoles}
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
        <AppSnackbar
          open={showAlert}
          severity="error"
          message={capitalizeFirstLetter(alertMessage)}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

const mapStateToProps = ({ settings, Projects, Users }) => {
  const { drawerType } = settings;
  const { userDetail } = Users;
  const systemRoles = settings.roles.list;
  const projectsList = Projects.projectsList;
  return {
    drawerType,
    systemRoles,
    projectsList,
    userDetail,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    editUserWithCallback,
    getRoles,
    getUserDetail,
    getProjects,
  })(EditProject),
);
