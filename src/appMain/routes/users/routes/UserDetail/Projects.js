import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getUserDetail,
  editUserWithCallback,
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
      userId: props.match.params.userId,
      addUsersList: [],
    };
  }

  componentDidMount() {
    const { getUserDetail } = this.props;
    const { userId } = this.state;
    getUserDetail(userId);
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
    const { getUserDetail } = this.props;
    const { userId } = this.state;
    getUserDetail(userId);
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

    return [
      {
        type: "regular",
        value: data.project,
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
            disabled: hasAdminRole || data.group,
            handleClick: () => this.handleChangeRoles(data),
          },
          {
            type: "danger-icon",
            label: "Delete",
            disabled: hasAdminRole || data.group,
            confirmText,
            handleClick: () => this.handleDeleteProject(data),
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
    const { userDetail } = this.props;
    let tableData = [];
    if (
      userDetail.spec.projectNamespaceRoles &&
      userDetail.spec.projectNamespaceRoles.length > 0
    ) {
      tableData = this.processProjectWithNamespaces(
        userDetail.spec.projectNamespaceRoles
      );
      if (tableData.length > 0)
        tableData = this.processProjectWithRoles(tableData);
    }

    let createDisabled = false;
    if (
      userDetail.spec.projectNamespaceRoles &&
      userDetail.spec.projectNamespaceRoles.length > 0 &&
      userDetail.spec.projectNamespaceRoles.find((r) =>
        ["ADMIN", "ADMIN_READ_ONLY"].includes(r.role)
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
          <InfoCardComponent
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
        <AppSnackbar
          open={showError}
          message={capitalizeFirstLetter(deleteError)}
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
    getUserDetail,
    editUserWithCallback,
    resetProjectError,
  })(Projects)
);
