import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getUserRoles,
  unassignUserFromProject,
  resetProjectError,
} from "actions/index";
import T from "i18n-react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import RafaySnackbar from "components/RafaySnackbar";
import DataTableToolbar from "components/RafayTable/DataTableToolbar";
import DataTable from "components/RafayTable/DataTable";
import RafayInfoCard from "components/RafayInfoCard";
import RolesInfo from "components/RolesInfo";

class Projects extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      list: [],
      userId: props.match.params.userId,
      addUsersList: [],
    };
  }

  componentDidMount() {
    const { getUserRoles, match } = this.props;
    getUserRoles(match.params.userId);
  }

  static getDerivedStateFromProps(props, state) {
    const { isAddUserError, error, resetProjectError } = props;
    if (isAddUserError) {
      resetProjectError();
      return {
        ...state,
        deleteError: error.details[0].detail,
        showError: true,
      };
    }
    return state;
  }

  handleCreateClick = () => {
    const { history } = this.props;
    const { userId } = this.state;
    history.push(`/main/users/${userId}/assigntoproject`);
  };

  handleResponseErrorClose = () => {
    this.setState({ showError: false, deleteError: null });
  };

  successCallback = () => {
    const { getUserRoles } = this.props;
    const { userId } = this.state;
    getUserRoles(userId);
  };

  errorCallback = (error) => {
    this.setState({
      showError: true,
      deleteError: error.details[0].detail,
    });
  };

  handleDeleteProject = (data) => {
    const postData = { ...data };
    if (
      postData.project.name === "ALL PROJECTS" &&
      postData.roles[0].role.scope === "ORGANIZATION"
    ) {
      delete postData.project;
    }
    const { userId } = this.state;
    const { unassignUserFromProject } = this.props;
    unassignUserFromProject(
      userId,
      postData,
      this.successCallback,
      this.errorCallback
    );
  };

  handleChangeRoles = (data) => {
    const { history } = this.props;
    const { userId } = this.state;
    let projectId = "all";
    if (
      data.project.name !== "ALL PROJECTS" &&
      data.roles[0].role.scope !== "ORGANIZATION"
    ) {
      projectId = data.project.id;
    }
    history.push(`/main/users/${userId}/project/${projectId}`);
  };

  parseRowData = (data) => {
    const dataRoles = data.roles.map((r) => r.role.name);
    const uniqueDataRoles = [...new Set(dataRoles)];
    const hasAdminRole = uniqueDataRoles.indexOf("ADMIN") !== -1;
    const confirmText = (
      <span>
        <span>Are you sure you want to unassign the user from project </span>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>
          {data.project.name}
        </span>
        <span> ?</span>
      </span>
    );
    const isGroupRole = data.roles?.reduce((isGroup, e) => {
      return !!e.group && isGroup;
    }, true);
    return [
      {
        type: "regular",
        value: data.project.name,
      },
      {
        type: "regular",
        value: (
          <RolesInfo
            roles={data?.roles}
            projectId={data?.project?.id}
            addGroupInRole
          />
        ),
      },
      {
        type: "buttons",
        buttons: [
          {
            type: "edit-icon",
            label: "Change Roles",
            disabled: hasAdminRole || isGroupRole,
            handleClick: () => this.handleChangeRoles(data),
          },
          {
            type: "danger-icon",
            label: "Delete",
            disabled: hasAdminRole || isGroupRole,
            confirmText,
            handleClick: () => this.handleDeleteProject(data),
          },
        ],
      },
    ];
  };

  render() {
    const { showError, deleteError } = this.state;
    const { userRoles } = this.props;
    const tableData = [];
    for (let index = 0; index < userRoles.length; index++) {
      const element = userRoles[index];
      let found = null;
      if (element.project) {
        found = tableData.find((d) => d.project.name === element.project.name);
      } else {
        found = tableData.find((d) => d.project.name === "ALL PROJECTS");
        element.project = { name: "ALL PROJECTS" };
      }

      if (found) {
        const roles = new Set(found.roles);
        roles.add(element);
        found.roles = [...roles];
      } else {
        tableData.push({
          project: element.project,
          roles: [element],
        });
      }
    }

    let createDisabled = false;
    if (
      userRoles &&
      userRoles.length > 0 &&
      userRoles.find((r) => r.role.name === "ADMIN")
    ) {
      createDisabled = true;
    }

    const AddToProjectButton = (
      <Button
        variant="contained"
        className="jr-btn jr-btn-label left text-nowrap text-white mt-2 ml-2"
        onClick={this.handleCreateClick}
        style={{ marginRight: 8 }}
        disabled={createDisabled}
        color="primary"
        id="add_to_group"
      >
        <span>Assign User To Project</span>
      </Button>
    );

    if (!tableData.length) {
      return (
        <>
          <RafayInfoCard
            title={<T.span text="users.user_detail.no_projects.title" />}
            linkHelper={
              <T.span text="users.user_detail.no_projects.helptext" />
            }
            link={AddToProjectButton}
          />
        </>
      );
    }

    const columnLabels = [
      {
        label: "Project",
      },
      {
        label: "Roles",
      },
      {
        label: "",
      },
    ];

    return (
      <div className="">
        <Paper>
          <DataTableToolbar button={AddToProjectButton} />
          <DataTable
            columnLabels={columnLabels}
            list={tableData}
            parseRowData={this.parseRowData}
          />
        </Paper>
        <RafaySnackbar
          open={showError}
          message={deleteError}
          closeCallback={this.handleResponseErrorClose}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ settings, Users }) => {
  const { userRoles } = Users;
  const orgUsersList = settings.users.list;
  const rolesList = settings.roles.list;
  return {
    userRoles,
    orgUsersList,
    rolesList,
    // isAddUserError,
    // error
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getUserRoles,
    unassignUserFromProject,
    resetProjectError,
  })(Projects)
);
