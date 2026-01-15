/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { editUserWithCallback, getRoles, getUserDetail } from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import AppSnackbar from "components/AppSnackbar";
import PageHeader from "components/PageHeader";
import ProjectRoleWidget from "./ProjectRoleWidget";
import { parseError } from "utils";
import { capitalizeFirstLetter } from "../../../../../utils";

class AssignToProject extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userId: props.match.params.userId,
      username: "",
      selectedProject: null,
      selectedNamespaces: null,
      selectedRoles: null,
    };
  }

  componentDidMount() {
    const { getRoles, getUserDetail, getUserRoles } = this.props;
    const { userId } = this.state;
    getRoles();
    getUserDetail(userId);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { userDetail } = props;
    if (userDetail) {
      newState.username = userDetail.metadata.name;
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
      alertMessage: parseError(message),
    });
  };

  transformRoles = () => {
    const { selectedRoles, selectedProject, selectedNamespaces } = this.state;
    const roles = [];
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
      } else {
        let r = {
          project: selectedProject,
          role: role.metadata.name,
        };
        roles.push(r);
      }
    });
    return roles;
  };

  handleSaveChanges = () => {
    const { selectedProject, selectedRoles, userId, selectedNamespaces } =
      this.state;
    const { userDetail, editUserWithCallback } = this.props;
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
      if (r.spec.scope === "namespace" && !selectedNamespaces) {
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
    if (!userDetail.spec.projectNamespaceRoles) {
      userDetail.spec.projectNamespaceRoles = this.transformRoles();
    } else {
      userDetail.spec.projectNamespaceRoles.push(...this.transformRoles());
    }

    editUserWithCallback(userDetail, this.successCallback, this.errorCallback);
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
    const { username, userId, showAlert, alertMessage, selectedNamespaces } =
      this.state;
    const { drawerType, systemRoles, projectsList, userDetail } = this.props;

    let filteredProjectsList = projectsList.items;
    if (userDetail && userDetail.spec.projectNamespaceRoles) {
      filteredProjectsList = projectsList.items.filter(
        (p) =>
          !userDetail.spec.projectNamespaceRoles.find((ur) => {
            if (ur.project) {
              return ur.project === p.metadata.name;
            }
            return false;
          })
      );
    }

    const hasProjectRole =
      filteredProjectsList &&
      projectsList &&
      projectsList.items.length !== filteredProjectsList.length;

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
          label: <T.span text="users.assign_to_project.layout.title" />,
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <PageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="users.assign_to_project.layout.title"
            help="users.assign_to_project.layout.helptext"
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
  })(AssignToProject)
);
