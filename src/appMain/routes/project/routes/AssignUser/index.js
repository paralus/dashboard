/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  editProjectWithCallback,
  getRoles,
  getProject,
  getUsers,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafaySnackbar from "components/RafaySnackbar";
import RafayPageHeader from "components/RafayPageHeader";
import ProjectRoleWidget from "./ProjectRoleWidget";
import { capitalizeFirstLetter } from "../../../../../utils";

class AssignUser extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectId: props.match.params.projectId,
      projectName: "",
      selectedUser: null,
      selectedNamespaces: null,
      selectedRoles: null,
    };
  }

  componentDidMount() {
    const { getRoles, getProject, getUsers } = this.props;
    const { projectId } = this.state;
    getRoles();
    getUsers();
    getProject(projectId);
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

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  successCallback = () => {
    const { history } = this.props;
    const { projectId } = this.state;
    history.push(`/main/projects/${projectId}`);
  };

  errorCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
    });
  };

  transformRoles = () => {
    const { selectedUser, selectedRoles } = this.state;
    const roles = [];
    selectedRoles.forEach((role) => {
      let r = {
        user: selectedUser.metadata.name,
        role: role.metadata.name,
      };
      roles.push(r);
    });
    return roles;
  };

  handleSaveChanges = () => {
    const { selectedUser, selectedRoles } = this.state;
    const { editProjectWithCallback, projectDetail } = this.props;
    if (!selectedUser) {
      this.setState({
        showAlert: true,
        alertMessage: "Please select a user",
      });
      return;
    }
    if (!selectedRoles) {
      this.setState({
        showAlert: true,
        alertMessage: "Please select a role",
      });
      return;
    }
    if (!projectDetail.spec.userRoles) {
      projectDetail.spec.userRoles = this.transformRoles();
    } else {
      projectDetail.spec.userRoles.push(...this.transformRoles());
    }
    editProjectWithCallback(
      projectDetail,
      this.successCallback,
      this.errorCallback
    );
  };

  handleUserChange = (user) => {
    this.setState({ selectedUser: user });
  };

  handleNamespacesChange = (namespaces) => {
    this.setState({ selectedNamespaces: namespaces });
  };

  handleRolesChange = (checked) => {
    this.setState({ selectedRoles: checked });
  };

  render() {
    const { projectName, projectId, showAlert, alertMessage } = this.state;
    const { drawerType, systemRoles, usersList } = this.props;
    let filteredUsersList = usersList
      .filter((u) =>
        u.spec.projectNamespaceRoles?.find((pnr) => pnr.role !== "ADMIN")
      ) // Filter out all users with ADMIN roles
      .filter(
        (a) =>
          !a.spec.projectNamespaceRoles?.find(
            (pnr) => pnr.project === projectId
          )
      ); // Filter out users already assigned to the project
    if (filteredUsersList.length === 0) {
      filteredUsersList = usersList.filter(
        (u) => !u.spec.projectNamespaceRoles
      );
    }
    const config = {
      links: [
        {
          label: `Projects`,
          href: "#/main",
        },
        {
          label: `${projectName}`,
          href: `#/main/projects/${projectId}`,
        },
        {
          label: <T.span text="projects.assign_user.layout.title" />,
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <RafayPageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="projects.assign_user.layout.title"
            help="projects.assign_user.layout.helptext"
          />
          <ProjectRoleWidget
            onNamespacesChange={this.handleNamespacesChange}
            onUserChange={this.handleUserChange}
            handleRolesChange={this.handleRolesChange}
            systemRoles={systemRoles}
            usersList={filteredUsersList}
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
          message={capitalizeFirstLetter(alertMessage)}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

const mapStateToProps = ({ settings, Projects }) => {
  const { drawerType } = settings;
  const { projectDetail } = Projects;
  const systemRoles = settings.roles.list;
  let usersList = [];
  if (settings.users && settings.users.list) {
    usersList = settings.users.list;
  }
  return {
    drawerType,
    systemRoles,
    usersList,
    projectDetail,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    editProjectWithCallback,
    getRoles,
    getUsers,
    getProject,
  })(AssignUser)
);
