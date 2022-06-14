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
import AppSnackbar from "components/AppSnackbar";
import DataTableToolbar from "components/TableComponents/DataTableToolbar";
import DataTable from "components/TableComponents/DataTable";
import InfoCardComponent from "components/InfoCardComponent";
import RolesInfo from "components/RolesInfo";
import { capitalizeFirstLetter } from "../../../../../utils";

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
      uniqueDataRoles.indexOf("ADMIN_READ_ONLY") !== -1;
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
        value: (
          <RolesInfo
            projectId={data?.project}
            addGroupInRole
            roleInfo={data?.roleInfo}
          />
        ),
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

  processProjectWithNamespaces = (data) => {
    let processed = [];

    // pushing 1 project-role element into output array
    processed.push({
      project: data[0].project ? data[0].project : "ALL PROJECTS",
      role: data[0].role,
      group: data[0]?.group,
      namespaces: data[0].namespace ? [data[0].namespace] : [],
    });

    // remove 1st element from data array
    data.shift();

    if (data.length > 0) {
      data.forEach((e) => {
        let similarElement = processed.find(
          (element) => element.project === e.project && element.role === e.role
        );
        if (!similarElement) {
          processed.push({
            project: e.project ? e.project : "ALL PROJECTS",
            role: e.role,
            group: e?.group,
            namespaces: e.namespace ? [e.namespace] : [],
          });
        } else {
          const SimilarElementIndex = processed.findIndex((object) => {
            return (
              object.project === similarElement.project &&
              object.role === similarElement.role
            );
          });
          similarElement.namespaces.push(e.namespace);
          processed[SimilarElementIndex] = similarElement;
        }
      });
    }
    return processed;
  };

  processProjectWithRoles = (data) => {
    let processed = [];

    // pushing 1 project-role element into processed array
    processed.push({
      project: data[0]?.project,
      group: data[0]?.group,
      roleInfo: [{ roleName: data[0].role, namespaces: data[0].namespaces }],
    });

    // remove 1st element from data array
    data.shift();

    if (data.length > 0) {
      data.forEach((e) => {
        let similarElement = processed.find(
          (element) => element.project === e.project
        );
        if (!similarElement) {
          processed.push({
            project: e.project,
            group: e?.group,
            roleInfo: [{ roleName: e.role, namespaces: e.namespaces }],
          });
        } else {
          const SimilarElementIndex = processed.findIndex((object) => {
            return object.project === similarElement.project;
          });
          similarElement.roleInfo.push({
            roleName: e.role,
            namespaces: e.namespaces,
          });
          processed[SimilarElementIndex] = similarElement;
        }
      });
    }
    return processed;
  };

  render() {
    const { showError, deleteError } = this.state;
    const { groupDetail } = this.props;
    let tableData = [];
    if (
      groupDetail &&
      groupDetail.spec.projectNamespaceRoles &&
      groupDetail.spec.projectNamespaceRoles.length > 0
    ) {
      tableData = this.processProjectWithNamespaces(
        groupDetail.spec.projectNamespaceRoles
      );
      if (tableData.length > 0)
        tableData = this.processProjectWithRoles(tableData);
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
          <InfoCardComponent
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
        <AppSnackbar
          open={showError}
          message={capitalizeFirstLetter(deleteError)}
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
