import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getGroupDetail,
  editGroupWithCallback,
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
      groupId: props.match.params.groupId,
      addUsersList: [],
    };
  }

  componentDidMount() {
    const { getGroupDetail } = this.props;
    const { groupId } = this.state;
    getGroupDetail(groupId);
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
    const { groupId } = this.state;
    const { history } = this.props;
    history.push(`/main/groups/${groupId}/assigntoproject`);
  };

  successCallback = () => {
    // const { history } = this.props;
    // const { userId } = this.state;
    // history.push(`/main/users/${userId}`);
  };

  errorCallback = (message) => {
    this.setState({
      showError: true,
      deleteError: message,
    });
  };

  arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele.project != value;
    });
  };

  handleDeleteProject = (groupId, data) => {
    const { groupDetail, editGroupWithCallback } = this.props;
    groupDetail.spec.projectNamespaceRoles = this.arrayRemove(
      groupDetail.spec.projectNamespaceRoles,
      data.project
    );
    editGroupWithCallback(
      groupDetail,
      this.successCallback,
      this.errorCallback
    );
  };

  handleResponseErrorClose = () => {
    this.setState({ showError: false, deleteError: null });
  };

  handleChangeRoles = (data) => {
    const { history } = this.props;
    const { groupId } = this.state;
    let projectId = "all";
    if (data.project !== "ALL PROJECTS") {
      projectId = data.project;
    }
    history.push(`/main/groups/${groupId}/project/${projectId}`);
  };

  parseRowData = (data) => {
    const { groupId } = this.state;
    const { isDefaultAdminsGroup } = this.props;
    const dataRoles = data.roles;
    const uniqueDataRoles = [...new Set(dataRoles)];
    const hasAdminRole = uniqueDataRoles.indexOf("ADMIN") !== -1;
    const hasAdminReadOnlyRole =
      uniqueDataRoles.indexOf("ADMINISTRATOR_READ_ONLY") !== -1;
    const confirmText = (
      <span>
        <span>
          Are you sure you want to delete the projects from the group ?
        </span>
      </span>
    );
    return [
      {
        type: "regular",
        value: data.project ? data.project : "ALL PROJECTS",
      },
      {
        type: "regular",
        value: <RolesInfo roles={data?.roles} projectId={data?.project} />,
      },
      {
        type: "buttons",
        buttons: [
          {
            type: "edit-icon",
            label: "Change Roles",
            disabled: hasAdminRole || hasAdminReadOnlyRole,
            handleClick: () => this.handleChangeRoles(data),
          },
          {
            type: "danger-icon",
            label: "Delete",
            disabled: isDefaultAdminsGroup,
            confirmText,
            handleClick: () => this.handleDeleteProject(groupId, data),
          },
        ],
      },
    ];
  };

  render() {
    const { showError, deleteError } = this.state;
    const { groupDetail } = this.props;
    const tableData = [];
    if (
      groupDetail &&
      groupDetail.spec.projectNamespaceRoles &&
      groupDetail.spec.projectNamespaceRoles.length > 0
    ) {
      for (
        let index = 0;
        index < groupDetail.spec.projectNamespaceRoles.length;
        index++
      ) {
        const element = groupDetail.spec.projectNamespaceRoles[index];
        let found = null;
        if (element.project) {
          found = tableData.find((d) => d.project === element.project);
        } else {
          found = tableData.find((d) => d.project === "ALL PROJECTS");
          element.project = "ALL PROJECTS";
        }
        if (found) {
          const roles = new Set(found.roles);
          roles.add(element.role);
          found.roles = [...roles];
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
      groupDetail &&
      groupDetail.spec.projectNamespaceRoles &&
      groupDetail.spec.projectNamespaceRoles.length > 0 &&
      groupDetail.spec.projectNamespaceRoles.find((p) =>
        ["ADMIN", "ADMIN_READ_ONLY"].includes(p.role)
      )
    ) {
      createDisabled = true;
    }
    const AddToProjectButton = (
      <Button
        variant="contained"
        className="jr-btn jr-btn-label left text-nowrap text-white ml-2 mt-2"
        onClick={this.handleCreateClick}
        style={{ marginRight: 8 }}
        color="primary"
        id="assign_to_project"
        disabled={createDisabled}
      >
        <span>Assign Group to Project</span>
      </Button>
    );

    if (!tableData.length) {
      return (
        <>
          <RafayInfoCard
            title={<T.span text="groups.group_detail.no_projects.title" />}
            linkHelper={
              <T.span text="groups.group_detail.no_projects.helptext" />
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

const mapStateToProps = ({ settings, Groups }) => {
  const { groupDetail } = Groups;
  const orgUsersList = settings.users.list;
  const rolesList = settings.roles.list;
  return {
    groupDetail,
    orgUsersList,
    rolesList,
    // isAddUserError,
    // error
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getGroupDetail,
    editGroupWithCallback,
    resetProjectError,
  })(Projects)
);
