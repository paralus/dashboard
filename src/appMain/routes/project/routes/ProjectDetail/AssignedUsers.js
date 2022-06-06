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
      deleteError: error.message,
    });
  };

  handleDeleteUser = (data) => {
    const { editProjectWithCallback } = this.props;
    const { projectId } = this.state;

    const params = {
      user: data.user,
    };
    editProjectWithCallback(
      projectId,
      params,
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
        value: <RolesInfo roles={data?.roles} projectId={projectId} />,
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

    const tableData = [];
    for (let index = 0; index < projUsers.length; index++) {
      const element = projUsers[index];
      let found = null;
      found = tableData.find((d) => d.user === element.user);

      if (found) {
        const roles = new Set(found.roles);
        roles.add(element.role);
        found.roles = [...roles];
      } else {
        tableData.push({
          user: element.user,
          roles: [element.role],
        });
      }
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
