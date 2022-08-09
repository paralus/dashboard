import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getProject,
  resetProjectError,
  editProjectWithCallback,
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

class AssignedUsers extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectId: props.match.params.projectId,
    };
  }

  componentDidMount() {
    const { getProject } = this.props;
    const { projectId } = this.state;
    getProject(projectId);
  }

  static getDerivedStateFromProps(props, state) {
    const { isAddUserError, error, resetProjectError } = props;
    if (isAddUserError) {
      resetProjectError();
      return {
        ...state,
        deleteError: error.message,
        showError: true,
      };
    }
    return state;
  }

  handleCreateClick = () => {
    const { history } = this.props;
    const { projectId } = this.state;
    history.push(`/main/projects/${projectId}/assignuser`);
  };

  handleResponseErrorClose = () => {
    this.setState({ showError: false, deleteError: null });
  };

  successCallback = () => {
    const { getProject } = this.props;
    const { projectId } = this.state;
    getProject(projectId);
  };

  errorCallback = (error) => {
    this.setState({
      showError: true,
      alertMessage: error,
    });
  };

  handleDeleteUser = (data) => {
    const { editProjectWithCallback, projectDetail } = this.props;

    projectDetail.spec.userRoles = projectDetail.spec.userRoles.filter(
      (r) => r.user != data.user
    );
    editProjectWithCallback(
      projectDetail,
      this.successCallback,
      this.errorCallback
    );
  };

  handleChangeRoles = (data) => {
    const { history } = this.props;
    const { projectId } = this.state;
    history.push(`/main/projects/${projectId}/users/${data.user}`);
  };

  parseRowData = (data) => {
    const { UserSession } = this.props;
    const { projectId } = this.state;
    const confirmText = (
      <span>
        <span>Are you sure you want to unassign </span>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>
          {data.user.username}
        </span>
        <span> from the project ?</span>
      </span>
    );
    return [
      {
        type: "regular",
        value: data.user,
      },
      {
        type: "regular",
        value: (
          <RolesInfo
            roles={data?.roles}
            projectId={projectId}
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
            disabled: !UserSession.visibleAdmin,
            handleClick: () => this.handleChangeRoles(data),
          },
          {
            type: "danger-icon",
            label: "Delete",
            disabled: !UserSession.visibleAdmin,
            confirmText,
            handleClick: () => this.handleDeleteUser(data),
          },
        ],
      },
    ];
  };

  processUsersWithNamespaces = (data) => {
    let processed = [];
    const firstElement = data[0];

    // pushing 1 project-role element into output array
    processed.push({
      user: firstElement.user,
      role: firstElement.role,
      namespaces: firstElement.namespace ? [firstElement.namespace] : [],
    });

    // remove 1st element from data array
    data = data.filter((element) => element !== firstElement);

    if (data.length > 0) {
      data.forEach((e) => {
        let similarElement = processed.find(
          (element) => element.user === e.user && element.role === e.role
        );
        if (!similarElement) {
          processed.push({
            role: e.role,
            user: e?.user,
            namespaces: e.namespace ? [e.namespace] : [],
          });
        } else {
          const SimilarElementIndex = processed.findIndex((object) => {
            return (
              object.role === similarElement.role &&
              object.user === similarElement.user
            );
          });
          similarElement.namespaces.push(e.namespace);
          processed[SimilarElementIndex] = similarElement;
        }
      });
    }
    return processed;
  };

  processUsersWithRoles = (data) => {
    let processed = [];

    // pushing 1 project-role element into processed array
    processed.push({
      user: data[0]?.user,
      roleInfo: [
        {
          roleName: data[0].role,
          namespaces: data[0].namespaces ? data[0].namespaces : [],
        },
      ],
    });

    // remove 1st element from data array
    data.shift();

    if (data.length > 0) {
      data.forEach((e) => {
        let similarElement = processed.find(
          (element) => element.user === e.user
        );
        if (!similarElement) {
          processed.push({
            user: e?.user,
            roleInfo: [{ roleName: e.role, namespaces: e.namespaces }],
          });
        } else {
          const SimilarElementIndex = processed.findIndex((object) => {
            return object.user === similarElement.user;
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
    const { projectDetail, UserSession } = this.props;

    const projUsers = projectDetail?.spec?.userRoles || [];

    const AddToProjectButton = (
      <Button
        variant="contained"
        className="jr-btn jr-btn-label left text-nowrap text-white mt-2 ml-2"
        onClick={this.handleCreateClick}
        style={{ marginRight: 8 }}
        disabled={!UserSession.visibleAdmin}
        color="primary"
        id="assign_user"
      >
        <span>Assign User To Project</span>
      </Button>
    );

    if (!projUsers.length) {
      return (
        <>
          <InfoCardComponent
            title={<T.span text="projects.project_detail.no_users.title" />}
            linkHelper={
              <T.span text="projects.project_detail.no_users.helptext" />
            }
            link={AddToProjectButton}
          />
        </>
      );
    }

    let tableData = [];
    if (projUsers && projUsers.length > 0) {
      tableData = this.processUsersWithNamespaces(projUsers);

      if (tableData.length > 0)
        tableData = this.processUsersWithRoles(tableData);
    }

    const columnLabels = [
      {
        label: "User",
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

const mapStateToProps = ({ Projects, UserSession }) => {
  const { projectDetail } = Projects;
  return {
    projectDetail,
    UserSession,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getProject,
    resetProjectError,
    editProjectWithCallback,
  })(AssignedUsers)
);
