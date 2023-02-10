import React from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import AvTimerIcon from "@material-ui/icons/AvTimer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import GroupIcon from "@material-ui/icons/Group";
import {
  getUsers,
  revokeKubeconfig,
  deleteUser,
  resetUserDeleteResponse,
} from "actions/index";
import ProjectList from "components/ProjectList";
import ProjectRoleMatrix from "components/ProjectRoleMatrix";
import AppSnackbar from "components/AppSnackbar";
import ConfirmIconAction from "components/ConfirmIconAction";
import DataTable from "components/TableComponents/DataTable";
import { IDP_USER_COLUMN_HEADER_CONFIG } from "constants/Constant";
import { getTimeFromNow, parseError } from "../../../../../utils";
import DataTableToolbar from "./components/DataTableToolbar";
import KubeconfigValiditySSO from "./components/KubeconfigValiditySSO";
import SsoGroups from "./components/IDPUserGroups/SsoGroups";
import DeleteIconComponent from "components/DeleteIconComponent";

const style = {
  userNameLabel: {
    color: "teal",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  lastAccessValue: {
    color: "#BDBDBD",
    fontSize: "0.8rem",
  },
  actionContainer: {
    paddingLeft: "2rem",
    float: "right",
  },
  userDetailContainer: {
    padding: "0.5rem 0",
    width: "12rem",
    overflowWrap: "break-word",
  },
  noResult: {
    textAlign: "center",
    margin: "0 2rem",
  },
};
class IDPUserList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: "desc",
      orderBy: "name",
      searchText: "",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      offset: 0,
      count: 5,
      showAlert: false,
      alertMessage: "",
      alertSeverity: "error",
      columnLabels: IDP_USER_COLUMN_HEADER_CONFIG,
      openGroups: false,
      selectedUser: null,
    };
  }

  componentDidMount() {
    this.props.getUsers(null, null, null, "", "", { type: "oidc" });
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.isDeleteUserSucess) {
      this.setState({
        data: [],
      });
      this.props.getUsers(null, null, null, "", "", { type: "oidc" });
    }
    props.resetUserDeleteResponse();
  }

  getLastLogin = (data) => {
    const last_login = data && data.split(".");
    if (last_login && last_login[0]) {
      return last_login[0].replace("T", " ");
    }
    return "Never";
  };

  onFailure = (error) => {
    this.setState({
      showAlert: true,
      alertMessage: parseError(error) || "Unexpected Error",
      alertSeverity: "error",
    });
  };

  handleSearchChange = (event) => {
    this.setState({
      searchText: event.target.value,
    });
  };

  handleRevokeKubeconfig = (_, user) => {
    if (user?.metadata?.id) {
      revokeKubeconfig(user.metadata.id, true)
        .then((_) => {
          this.setState({
            showAlert: true,
            alertMessage: (
              <>
                <span className="mr-2">Kubeconfig Revoked for</span>
                <b>{user.metadata.name}</b>
              </>
            ),
            alertSeverity: "success",
          });
        })
        .catch((error) => {
          this.setState({
            showAlert: true,
            alertMessage:
              error?.response?.data?.toString() || "Unexpected Error",
            alertSeverity: "error",
          });
        });
    }
  };

  handleAppSnackbarClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  handleGoToManageKeys = (_, id) => {
    const { history } = this.props;
    history.push(`${history.location.pathname}/${id}/ssokeys`);
  };

  formatProjects = (projects) => {
    return projects?.map((item) => {
      const newProjectObj = {
        role: item.role,
        group: item.group,
      };

      if (item?.project) {
        newProjectObj.project = item.project;
      }

      return newProjectObj;
    });
  };

  getCollapsedRow = (data) => {
    return (
      <ProjectRoleMatrix
        roles={this.formatProjects(data.spec.projectNamespaceRoles)}
      />
    );
  };

  parseRowData = (data) => {
    const userDetails = (
      <div style={style.userDetailContainer}>
        <div style={style.userNameLabel}> {data.metadata.name} </div>
      </div>
    );

    const projectDetails = (
      <ProjectList
        roles={this.formatProjects(data.spec.projectNamespaceRoles)}
      />
    );

    const lastAccessDetails = (
      <div style={style.lastAccessValue}>
        {data.spec.lastLogin ? (
          getTimeFromNow(data.spec.lastLogin)
        ) : (
          <span style={style.noResult}>-</span>
        )}
      </div>
    );

    const actionDetails = (
      <div style={style.actionContainer}>
        <Tooltip title="Manage Groups">
          <IconButton
            aria-label="groups"
            className="m-0"
            onClick={(_) => this.handleSSOUserGroups(data)}
          >
            <GroupIcon />
          </IconButton>
        </Tooltip>
        <DeleteIconComponent
          key={data.metadata.name}
          button={{
            type: "danger-icon",
            label: "Delete",
            confirmText: (
              <span>
                Are you sure you want to delete
                <b> {data.metadata.name} </b>?
              </span>
            ),
            handleClick: () => {
              this.props.deleteUser(data.metadata.name, null, this.onFailure);
            },
          }}
        />
        <Tooltip title="Manage Keys">
          <IconButton
            aria-label="edit"
            className="m-0"
            onClick={(event) =>
              this.handleGoToManageKeys(event, data.metadata.name)
            }
          >
            <i className="zmdi zmdi-key" />
          </IconButton>
        </Tooltip>
        <Tooltip title="KubeCTL Settings">
          <IconButton
            aria-label="edit"
            className="m-0"
            onClick={(_) =>
              this.setState({
                kubeconfigValidityOpen: true,
                currentUser: data,
              })
            }
          >
            <AvTimerIcon />
          </IconButton>
        </Tooltip>
        <ConfirmIconAction
          icon={<DesktopAccessDisabledIcon />}
          action={(event) => this.handleRevokeKubeconfig(event, data)}
          confirmText={
            <span className="mr-2">
              Are you sure you want to revoke kubectlconfig for
              <b> {data.metadata.name}</b> ?
            </span>
          }
          tooltip="Revoke Kubeconfig"
        />
      </div>
    );

    const rows = [
      {
        type: "regular",
        isExpandable: false,
        value: userDetails,
      },
      {
        type: "regular",
        isExpandable: true,
        value: projectDetails,
      },
      {
        type: "regular",
        isExpandable: false,
        value: lastAccessDetails,
      },
      {
        type: "regular",
        isExpandable: false,
        value: actionDetails,
      },
    ];

    return rows;
  };

  handleGoToSSOUserDetails = (_, id) => {
    const { history } = this.props;
    history.push(`${history.location.pathname}/${id}/ssouser`);
  };

  handleSSOUserGroups = (user) => {
    this.setState({
      openGroups: true,
      selectedUser: user,
    });
  };

  render() {
    const {
      selected,
      rowsPerPage,
      page,
      searchText,
      openGroups,
      selectedUser,
    } = this.state;
    const { users, getUsersIsLoading } = this.props;
    let data = [];
    let listCount = 0;

    if (users) {
      data = users;
      listCount = data.length;
    }

    if (this.state.searchText) {
      data = data.filter(
        (u) => u.metadata.name.indexOf(this.state.searchText) !== -1
      );
      listCount = data.length;
    }

    return (
      <div>
        <Paper>
          <DataTableToolbar
            numSelected={selected.length}
            handleCreateClick={this.handleCreateClick}
            handleSearchChange={(e) => this.handleSearchChange(e)}
            searchValue={searchText}
            hideAdd
          />
          {!getUsersIsLoading && (
            <DataTable
              columnLabels={this.state.columnLabels}
              list={data || []}
              getCollapsedRow={this.getCollapsedRow}
              parseRowData={this.parseRowData}
            />
          )}
        </Paper>
        <AppSnackbar
          open={this.state.showAlert}
          severity={this.state.alertSeverity}
          message={this.state.alertMessage}
          closeCallback={this.handleAppSnackbarClose}
        />
        <KubeconfigValiditySSO
          open={this.state.kubeconfigValidityOpen}
          user={this.state.currentUser}
          onClose={(_) => this.setState({ kubeconfigValidityOpen: false })}
          setAlert={(alert) => this.setState({ ...alert })}
        />
        <SsoGroups
          open={openGroups}
          user={selectedUser}
          onClose={(_) => {
            this.setState({ openGroups: false, selectedUser: null }, (_) =>
              this.props.getUsers(null, null, null, "", "", { type: "oidc" })
            );
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const users = settings.users.list;
  const { isDeleteUserSucess, getUsersIsLoading } = settings;
  return {
    users,
    isDeleteUserSucess,
    getUsersIsLoading,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    getUsers,
    deleteUser,
    resetUserDeleteResponse,
  })(IDPUserList)
);
