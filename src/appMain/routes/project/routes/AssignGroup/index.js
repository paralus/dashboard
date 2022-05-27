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
import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafaySnackbar from "components/RafaySnackbar";
import RafayPageHeader from "components/RafayPageHeader";
import ProjectRoleWidget from "./ProjectRoleWidget";
import { capitalizeFirstLetter } from "../../../../../utils";

class AssignGroup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectId: props.match.params.projectId,
      projectName: "",
      selectedGroup: null,
      selectedNamespaces: null,
      selectedRoles: null,
      projectGroups: [],
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
    const { projectDetail } = props;
    if (projectDetail) {
      newState.projectName = projectDetail.metadata.name;
      if (projectDetail.spec.projectNamespaceRoles) {
        newState.projectGroups =
          projectDetail.spec.projectNamespaceRoles.filter(
            (pnr) => pnr.group && pnr.group.length > 0
          );
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
    const { selectedGroup, selectedRoles, projectId } = this.state;
    const roles = [];
    selectedRoles.forEach((role) => {
      let r = {
        project: projectId,
        role: role.metadata.name,
        group: selectedGroup,
      };
      roles.push(r);
    });
    return roles;
  };

  handleSaveChanges = () => {
    const { selectedGroup, selectedRoles } = this.state;
    const { editProjectWithCallback, projectDetail } = this.props;
    if (!selectedGroup) {
      this.setState({
        showAlert: true,
        alertMessage: "Please select a group",
      });
      return;
    }
    if (!selectedRoles || selectedRoles.length === 0) {
      this.setState({
        showAlert: true,
        alertMessage: "Please select a role",
      });
      return;
    }
    if (!projectDetail.spec.projectNamespaceRoles) {
      projectDetail.spec.projectNamespaceRoles = this.transformRoles();
    } else {
      projectDetail.spec.projectNamespaceRoles.push(...this.transformRoles());
    }
    editProjectWithCallback(
      projectDetail,
      this.successCallback,
      this.errorCallback
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
      projectName,
      projectId,
      showAlert,
      alertMessage,
      selectedNamespaces,
      projectGroups,
    } = this.state;
    const { drawerType, systemRoles, groupsList } = this.props;

    let filteredGroupList = [];
    if (groupsList) {
      filteredGroupList = groupsList.filter((g) => g.spec.type === "SYSTEM");
      if (projectGroups) {
        filteredGroupList = filteredGroupList.filter(
          (g) => !projectGroups.find((pgr) => pgr.group === g.metadata.name)
        );
      }
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
          label: <T.span text="projects.assign_group.layout.title" />,
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <RafayPageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="projects.assign_group.layout.title"
            help="projects.assign_group.layout.helptext"
          />
          <ProjectRoleWidget
            onNamespacesChange={this.handleNamespacesChange}
            onGroupChange={this.handleGroupChange}
            handleRolesChange={this.handleRolesChange}
            systemRoles={systemRoles}
            editNamespaces={selectedNamespaces}
            groupsList={filteredGroupList}
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

const mapStateToProps = ({ settings, Projects, Groups }) => {
  const { drawerType } = settings;
  const { projectDetail } = Projects;
  const { groupsList } = Groups;
  const systemRoles = settings.roles.list;
  return {
    drawerType,
    systemRoles,
    groupsList,
    projectDetail,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    editProjectWithCallback,
    getRoles,
    getProject,
    getGroups,
  })(AssignGroup)
);
