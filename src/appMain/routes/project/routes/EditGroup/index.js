/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  editProjectWithCallback,
  getRoles,
  getProject,
  getGroups,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import AppSnackbar from "components/AppSnackbar";
import ProjectRoleWidget from "./ProjectRoleWidget";
import { capitalizeFirstLetter } from "../../../../../utils";

class EditGroup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectId: props.match.params.projectId,
      groupId: props.match.params.groupId,
      groupName: "",
      selectedGroup: null,
      selectedNamespaces: null,
      selectedRoles: null,
      editRoles: null,
    };
  }

  componentDidMount() {
    const { getRoles, getProject, getGroups } = this.props;
    const { projectId } = this.state;
    getRoles();
    getGroups();
    getProject(projectId);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { projectDetail, groupsList } = props;
    if (projectDetail) {
      newState.groupName = projectDetail.metadata.name;
      if (projectDetail.spec.projectNamespaceRoles) {
        newState.editRoles = projectDetail.spec.projectNamespaceRoles.filter(
          (pnr) =>
            pnr.group && pnr.group.length > 0 && pnr.group === newState.groupId,
        );
      }
    }
    if (groupsList && !newState.selectedGroup) {
      newState.selectedGroup = groupsList.find(
        (g) => g.metadata.name === newState.groupId,
      );
      if (newState.selectedGroup) {
        newState.selectedGroup = newState.selectedGroup.metadata.name;
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
    const { selectedRoles, groupId, projectId, selectedNamespaces } =
      this.state;
    const { projectDetail } = this.props;

    const roles = projectDetail.spec.projectNamespaceRoles.filter(
      (e) => e.group !== groupId,
    );

    selectedRoles.forEach((role) => {
      if (role.spec.scope === "namespace") {
        selectedNamespaces.forEach((ns) => {
          let r = {
            project: projectId,
            role: role.metadata.name,
            group: groupId,
            namespace: ns,
          };
          roles.push(r);
        });
      } else {
        let r = {
          project: projectId,
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
    const { editProjectWithCallback, projectDetail } = this.props;
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

    projectDetail.spec.projectNamespaceRoles = this.transformRoles();
    editProjectWithCallback(
      projectDetail,
      this.successCallback,
      this.errorCallback,
    );
  };

  handleGroupChange = (group) => {
    this.setState({ selectedGroup: group });
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
      projectId,
      showAlert,
      alertMessage,
      selectedGroup,
      editRoles,
      selectedNamespaces,
    } = this.state;
    const { drawerType, systemRoles, groupsList } = this.props;

    let breadcrumbLabel = "";
    if (selectedGroup) {
      breadcrumbLabel = selectedGroup.name;
    }

    const config = {
      links: [
        {
          label: `Projects`,
          href: "#/main",
        },
        {
          label: `${groupName}`,
          href: `#/main/projects/${projectId}`,
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
          <div className="mb-3">
            <ResourceBreadCrumb config={config} />
          </div>
          <h2 style={{ color: "orange" }}>Change Group Roles</h2>
          <p
            style={{
              marginBottom: "0px",
              padding: "20px",
              fontStyle: "italic",
              color: "rgb(117, 117, 117)",
            }}
            className="pl-0 pt-0"
          >
            Select Users from the available list of users and add them to the
            Group
          </p>
          <ProjectRoleWidget
            onNamespacesChange={this.handleNamespacesChange}
            onGroupChange={this.handleGroupChange}
            handleRolesChange={this.handleRolesChange}
            systemRoles={systemRoles}
            groupsList={groupsList}
            editGroup={selectedGroup}
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

const mapStateToProps = ({ settings, Projects, Groups }) => {
  const { drawerType } = settings;
  const { projectDetail, projectGroups } = Projects;
  // const groupsList = Groups.groupsList.results;
  let groupsList = [];
  if (Groups.groupsList) {
    groupsList = Groups.groupsList;
  }
  const systemRoles = settings.roles.list;
  return {
    drawerType,
    systemRoles,
    groupsList,
    projectDetail,
    projectGroups,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    editProjectWithCallback,
    getRoles,
    getProject,
    getGroups,
  })(EditGroup),
);
