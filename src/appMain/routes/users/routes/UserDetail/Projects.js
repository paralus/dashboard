import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getUser,
  editUserWithCallback,
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
    const { getUser } = this.props;
    const { userId } = this.state;
    getUser(userId);
  };

  errorCallback = (error) => {
    this.setState({
      showError: true,
      deleteError: error.details[0].detail,
    });
  };

  arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele.project != value;
    });
  };

  handleDeleteProject = (data) => {
    const { userDetail, editUserWithCallback } = this.props;
    userDetail.spec.projectNamespaceRoles = this.arrayRemove(
      userDetail.spec.projectNamespaceRoles,
      data.project
    );
    editUserWithCallback(userDetail, this.successCallback, this.errorCallback);
  };

  handleChangeRoles = (data) => {
    const { history } = this.props;
    const { userId } = this.state;
    let projectId = "all";
    if (data.project !== "ALL PROJECTS") {
      projectId = data.project;
    }
    history.push(`/main/users/${userId}/project/${projectId}`);
  };

  parseRowData = (data) => {
    const dataRoles = data.role;
    const uniqueDataRoles = [...new Set(dataRoles)];
    const hasAdminRole = uniqueDataRoles.indexOf("ADMIN") !== -1;
    const confirmText = (
      <span>
        <span>Are you sure you want to unassign the user from project </span>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>
          {data.project}
        </span>
        <span> ?</span>
      </span>
    );
    const isGroupRole = false;
    if (data.group) {
      const isGroupRole = true;
    }

    return [
      {
        type: "regular",
        value: data.project,
      },
      {
        type: "regular",
        value: (
          <RolesInfo
            roles={data?.roles}
            projectId={data?.project}
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
    const { userDetail } = this.props;
    const tableData = [];
    if (
      userDetail.spec.projectNamespaceRoles &&
      userDetail.spec.projectNamespaceRoles.length > 0
    ) {
      for (
        let index = 0;
        index < userDetail.spec.projectNamespaceRoles.length;
        index++
      ) {
        const element = userDetail.spec.projectNamespaceRoles[index];
        let found = null;
        if (element.project) {
          found = tableData.find((d) => d.project === element.project);
        } else {
          found = tableData.find((d) => d.project === "ALL PROJECTS");
          element.project = "ALL PROJECTS";
        }

        if (found) {
          const roles = new Set(found.role);
          roles.add(element.role);
          found = [...roles];
        } else {
          tableData.push({
            project: element.project,
            roles: [element.role],
          });
        }
      }
    }

    let createDisabled = false;
    if (
      userDetail.spec.projectNamespaceRoles &&
      userDetail.spec.projectNamespaceRoles.length > 0 &&
      userDetail.spec.projectNamespaceRoles.find((r) =>
        ["ADMIN", "ADMINISTRATOR_READ_ONLY"].includes(r.role)
      )
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
  const orgUsersList = settings.users.list;
  const rolesList = settings.roles.list;
  const { userDetail } = Users;
  return {
    orgUsersList,
    rolesList,
    userDetail,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getUser,
    editUserWithCallback,
    resetProjectError,
  })(Projects)
);
