import React from "react";
import keycode from "keycode";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ContainerHeader from "components/ContainerHeader/index";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIconComponent from "components/DeleteIconComponent";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getUsers,
  getRoles,
  addUser,
  editUser,
  resetError,
  resetUserResponse,
  deleteUser,
  resetUserDeleteResponse,
  revokeKubeconfig,
  resetPassword,
  getGroups,
} from "actions/index";
import ProjectList from "components/ProjectList";
import ProjectRoleMatrix from "components/ProjectRoleMatrix";
import AppSnackbar from "components/AppSnackbar";
import {
  COLUMN_HEADER_CONFIG,
  MFA_LABELS,
  USER_TYPE_LABELS,
} from "constants/Constant";
import Spinner from "components/Spinner/Spinner";
import { parseError, getTimeFromNow, capitalizeFirstLetter } from "utils";
import DataTableDynamic from "components/TableComponents/DataTableDynamic";
import StatusIndicator from "components/StatusIndicator";
import DataTableToolbar from "./components/DataTableToolbar";
import CreateUserDialog from "./components/CreateUserDialog";
import UserListCellMenu from "./components/UserListCellMenu";
import { FileCopyOutlined, ArrowBack } from "@material-ui/icons";

const style = {
  helpText: {
    marginBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    fontStyle: "italic",
    color: "rgb(117, 117, 117)",
  },
  mutedLabel: {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#BDBDBD",
  },
  userNameLabel: {
    color: "teal",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  userNameTitleLabel: {
    color: "#BDBDBD",
    fontSize: "0.7rem",
    lineHeight: "1.5rem",
    cursor: "pointer",
    fontWeight: "500",
  },
  userTypeLabel: {
    color: "#BDBDBD",
    fontSize: "0.8rem",
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
  urlCopy: {
    position: "relative",
    borderRadius: "3px",
    backgroundColor: "whitesmoke",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "grey",
    color: "black",
    paddingLeft: "15px",
    paddingRight: "15px",
    minHeight: "40px",
    display: "flex",
    alignItems: "center",
  },
};

const copyable =
  window.location.protocol === "https:" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost";

class UserList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      order: "",
      orderBy: "",
      searchText: "",
      selected: [],
      data: [], // workloads.sort((a, b) => (a.name < b.name ? -1 : 1)),
      page: 0,
      rowsPerPage: 10,
      offset: 0,
      count: 5,
      open: false,
      isResponseError: false,
      menuState: false,
      anchorEl: undefined,
      user: {
        account: {
          username: "",
          first_name: "",
          last_name: "",
          password: "",
          phone: "",
          console: true,
          programmatic: false,
        },
        role: {
          id: "",
        },
        default: true,
      },
      showAlert: false,
      alertMessage: "",
      alertSeverity: "error",
      searchDelay: 500,
      filters: {
        project: ["ALL"],
        role: "ALL",
        group: "ALL",
        status: "ALL",
      },
      userListData: [],
      isTotpEnabled: false,
      columnLabels: [],
      resetPasswordOpen: false,
      passwordResetLink: null,
      passwordResetUserName: null,
    };
  }

  componentDidMount() {
    this.fetchUsers();
    this.props.getGroups();
    this.props.getRoles();
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.users && props.isUserResponseError) {
      this.setState({
        isResponseError: true,
        isTotpEnabled: props.users?.list?.organization?.is_totp_enabled,
        columnLabels: COLUMN_HEADER_CONFIG.filter((e) => e.rule(this.state)),
      });
    } else {
      this.setState({
        isResponseError: false,
        isTotpEnabled: props.users?.list?.organization?.is_totp_enabled,
        columnLabels: COLUMN_HEADER_CONFIG.filter((e) => e.rule(this.state)),
      });
    }
    if (props.isAddUserSuccess && props.newUser) {
      this.setState({ open: false });
      this.fetchUsers();
      this.setState({ newUserOpen: true, newUserName: props.newUser.username });
    }
    if (props.isEditUserSuccess) {
      this.fetchUsers();
    }
    if (props.isDeleteUserSucess) {
      this.fetchUsers();
    }
    this.props.resetUserDeleteResponse();
    this.props.resetUserResponse();
    this.handlePaginatedData();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      count,
      rowsPerPage,
      page,
      offset,
      searchText,
      orderBy,
      order,
      filters,
    } = this.state;

    // Total count is not reflecting in the API
    if (this.props.users.listCount) {
      const count1 = this.props.users.listCount;
      if (count1 !== count) {
        this.setState({ count: count1 });
      }
    }

    if (
      (this.props.users?.list?.users &&
        count !== this.props.users?.list?.users?.length) ||
      page !== prevState.page ||
      rowsPerPage !== prevState.rowsPerPage
    ) {
      this.handlePaginatedData();
    }
  }

  handlePaginatedData = () => {
    let userListData = [];
    const { page, rowsPerPage } = this.state;
    const data = this.props.users?.list || [];
    let count = 0;

    if (data.length > rowsPerPage) {
      const startIndex = rowsPerPage * page;
      const endIndex = startIndex + rowsPerPage;
      userListData = data.slice(startIndex, endIndex);
    } else {
      userListData = data;
    }
    count = data.length;
    this.setState({ userListData, count });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy }, this.fetchUsers);
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map((n) => n.metadata.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleKeyDown = (event, id) => {
    if (keycode(event) === "space") {
      this.handleClick(event, id);
    }
  };

  handleCreateClick = (event) => {
    const { history } = this.props;
    history.push("/main/users/new");
  };

  handleClick = (event, id) => {
    const { users } = this.props;
    const user = users.list.users.find((item) => item.metadata.id === id);
    this.setState({
      user: {
        ...user,
        roles: [...user.roles],
      },
      open: true,
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    const rowsPerPage = event.target.value;
    this.setState({ rowsPerPage });
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  handleCreateUserClose = () => {
    this.setState({ open: false });
  };

  handleAccountChange = (name) => (event) => {
    const { user } = this.state;
    user.account[name] = event.target.value;
    this.setState({ user });
  };

  handleRoleChange = (name, index) => (event) => {
    const { user } = this.state;
    const { roles, projectsList } = this.props;
    if (name === "role") {
      const selectedRole = roles.list.find((e) => e.id === event.target.value);
      user.roles[index].role = { ...selectedRole };
    }
    if (name === "project") {
      const selectedProject = projectsList.find(
        (e) => e.id === event.target.value
      );
      user.roles[index].project = { ...selectedProject };
    }
    this.setState({ user });
  };

  handleAddAnotherRole = (event) => {
    const { user } = this.state;
    user.roles.push({ role: { id: "" }, project: { id: "" } });
    this.setState({ user });
  };

  handleRemoveRole = (index) => (_) => {
    const { user } = this.state;
    user.roles.splice(index, 1);
    this.setState({ user });
  };

  handleAdduser = (event) => {
    const { user } = this.state;
    const { addUser, getUsers, editUser } = this.props;
    for (let index = 0; index < user.roles.length; index++) {
      const element = user.roles[index];
      if (element.role.scope !== "PROJECT") {
        delete element.project;
      }
    }
    if (user.metadata.id) {
      editUser(user);
      const { rowsPerPage, offset, searchText, orderBy, order } = this.state;
      this.timeout = setTimeout(
        () => getUsers(null, null, searchText, orderBy, order),
        1000
      );
      this.handleCreateUserClose();
    } else {
      if (user.roles.length === 1 && user.roles[0].role.id === "") {
        delete user.roles;
      }
      addUser(user);
    }
  };

  handleResponseErrorClose = () => {
    this.props.resetError();
    this.props.resetUserDeleteResponse();
    this.setState({
      ...this.state,
      isResponseError: false,
    });
  };

  handleSearchChange = (event) => {
    const searchText = event.target.value;
    const {
      rowsPerPage,
      offset,
      orderBy,
      order,
      searchTimeoutlId,
      searchDelay,
      filters,
    } = this.state;
    if (searchTimeoutlId) clearTimeout(searchTimeoutlId);
    const timeoutId = setTimeout(() => {
      this.props.getUsers(null, null, searchText, orderBy, order, filters);
    }, searchDelay);

    this.setState({
      searchText,
      searchTimeoutlId: timeoutId,
    });
  };

  handleRevokeKubeconfig = (user) => {
    if (user?.metadata.id) {
      revokeKubeconfig(user.metadata.id)
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
            alertMessage: parseError(error) || "Unexpected Error",
            alertSeverity: "error",
          });
        });
    }
  };

  handleResetPassword = (user) => {
    if (user?.metadata.name) {
      resetPassword(user.metadata.name)
        .then((resp) => {
          const recoveryLink = resp?.data?.recoveryLink;
          this.setState({
            showAlert: true,
            resetPasswordOpen: true,
            recoveryLink,
            passwordResetUserName: user.metadata.name,
            alertMessage: (
              <>
                <span className="mr-2">Password reset link generated for</span>
                <b>{user.metadata.name}</b>
              </>
            ),
            alertSeverity: "success",
          });
        })
        .catch((error) => {
          this.setState({
            showAlert: true,
            recoveryLink: null,
            alertMessage: parseError(error) || "Unexpected Error",
            alertSeverity: "error",
          });
        });
    }
  };

  getErrorMessage = () => {
    if (!this.props.users.error) {
      return null;
    }
    if (typeof this.props.users.error === "string") {
      return (
        <span id="message-id">
          {capitalizeFirstLetter(this.props.users.error)}
        </span>
      );
    }
    alert("getErroMessage " + JSON.stringify(this.props.users.error));
    if (typeof this.props.users.error === {}) {
      return <span id="message-id">{this.props.users.error.message}</span>;
    }
    return (
      <span id="message-id">
        <ul className="list-group">
          {this.props.users.error.details.map((li, index) => (
            <li
              className="list-group-item"
              key={li}
              style={{
                backgroundColor: "transparent",
                border: "transparent",
              }}
            >
              {li.detail}
            </li>
          ))}
        </ul>
      </span>
    );
  };

  handleDownloadCli = () => {
    this.state.open1 = true;
    this.setState({ ...this.state });
  };

  handleGoToUserDetail = (e, id) => {
    const { history } = this.props;
    history.push(`/main/users/${id}/`);
  };

  handleGoToManageKeys = (id) => {
    const { history } = this.props;
    history.push(`${history.location.pathname}/${id}/keys`);
  };

  handleAppSnackbarClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  fetchUsers = () => {
    const { searchText, orderBy, order, filters } = this.state;
    this.props.getUsers(null, null, searchText, orderBy, order, filters);
  };

  handleFilterChange = (filter, value) => {
    let filters = { ...this.state.filters };
    filters = { ...filters, [filter]: value };
    this.setState({ filters }, this.fetchUsers);
  };

  onFailure = (error) => {
    this.setState({
      showAlert: true,
      alertMessage: parseError(error),
      alertSeverity: "error",
    });
  };

  getCollapsedRow = (data) => {
    return <ProjectRoleMatrix roles={data.spec.projectNamespaceRoles} />;
  };

  parseRowData = (data) => {
    const userDetails = (
      <div
        onClick={(event) =>
          this.handleGoToUserDetail(event, data.metadata.name)
        }
        style={style.userDetailContainer}
      >
        <StatusIndicator status={true} />
        <div style={style.userNameLabel}> {data.metadata.name} </div>
        <div style={style.userNameTitleLabel}>
          {" "}
          {`${data.spec.firstName} ${data.spec.lastName}`}{" "}
        </div>
      </div>
    );

    const projectDetails = (
      <ProjectList roles={data.spec.projectNamespaceRoles} />
    );

    const userTypeDetails = (
      <div style={style.userTypeLabel}>
        {" "}
        {USER_TYPE_LABELS[0]}
        {USER_TYPE_LABELS[1]}{" "}
      </div>
    );

    const lastAccessDetails = (
      <div style={style.lastAccessValue}>
        {" "}
        {data.spec.last_login ? (
          getTimeFromNow(data.spec.last_login)
        ) : (
          <span style={style.noResult}>-</span>
        )}{" "}
      </div>
    );

    const actionDetails = (
      <div style={style.actionContainer}>
        <Tooltip title="Edit">
          <IconButton
            aria-label="edit"
            className="m-0"
            onClick={(event) =>
              this.handleGoToUserDetail(event, data.metadata.name)
            }
          >
            <EditIcon fontSize="small" />
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
        <UserListCellMenu
          data={data}
          handleRevokeKubeconfig={this.handleRevokeKubeconfig}
          handleGoToManageKeys={this.handleGoToManageKeys}
          handleResetPassword={this.handleResetPassword}
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
        value: userTypeDetails,
      },
      {
        type: "regular",
        isExpandable: false,
        value: actionDetails,
      },
    ];

    return rows;
  };

  render() {
    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      menuState,
      anchorEl,
      searchText,
      count,
    } = this.state;
    const { match, users, deleteUser, projectsList } = this.props;
    let data = [];

    if (users.list) {
      data = users.list;
    }
    let roles = [];
    if (this.props.roles.list) {
      roles = this.props.roles.list;
    }

    if (data == null) {
      return <ContainerHeader title="Users" match={match} />;
    }

    return (
      <div>
        <Paper>
          <DataTableToolbar
            numSelected={selected.length}
            handleDownloadCli={this.handleDownloadCli}
            handleCreateClick={this.handleCreateClick}
            handleSearchChange={this.handleSearchChange}
            searchValue={searchText}
            handleFilterChange={this.handleFilterChange}
            filters={this.state.filters}
            projectsList={projectsList}
            groupsList={this.props.groupsList}
            rolesList={roles}
          />
          <Spinner loading={this.props.getUsersIsLoading} hideChildren>
            <DataTableDynamic
              columnLabels={this.state.columnLabels}
              list={this.state.userListData || []}
              getCollapsedRow={this.getCollapsedRow}
              parseRowData={this.parseRowData}
              handleGetRows={(_) => this.handleGetRows}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              count={count}
              customRowsPerPage={rowsPerPage}
              customPage={page}
              customHandleChangePage={this.handleChangePage}
              customHandleChangeRowsPerPage={this.handleChangeRowsPerPage}
              isSortEnabled
            />
          </Spinner>
        </Paper>
        <AppSnackbar
          open={this.state.showAlert}
          severity={this.state.alertSeverity}
          message={this.state.alertMessage}
          closeCallback={this.handleAppSnackbarClose}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.isResponseError}
          onClose={this.handleResponseErrorClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id",
            class: "bg-danger",
          }}
          className="mb-3"
          message={this.getErrorMessage()}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleResponseErrorClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <CreateUserDialog
          roles={roles}
          projectsList={projectsList}
          open={this.state.open || false}
          user={this.state.user}
          handleCreateWorkloadClose={this.handleCreateUserClose}
          handleAccountChange={this.handleAccountChange}
          handleRoleChange={this.handleRoleChange}
          handleAdduser={this.handleAdduser}
          handleAddAnotherRole={this.handleAddAnotherRole}
          handleRemoveRole={this.handleRemoveRole}
        />

        <Dialog
          open={this.state.newUserOpen || false}
          onBackdropClick={() => this.setState({ newUserOpen: false })}
          maxWidth="lg"
        >
          <DialogContent>
            New user <a style={{ color: "teal" }}>{this.state.newUserName}</a>,
            has been added successfully. Use the following link to set the
            password:
            <br />
            <div className={style.urlCopy}>
              <a
                style={{ color: "teal" }}
                href={this.props.newUser?.recoveryUrl}
              >
                {this.props.newUser?.recoveryUrl}
              </a>
              {copyable && (
                <Tooltip title={"Copy"} id="clip">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${this.props.newUser?.recoveryUrl}`
                      );
                    }}
                    aria-label="copy"
                  >
                    <FileCopyOutlined />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ newUserOpen: false })}
              id="newUserOpen"
              color="accent"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.resetPasswordOpen || false}
          onBackdropClick={() => this.setState({ resetPasswordOpen: false })}
          maxWidth="lg"
        >
          <DialogContent>
            Password reset link for user{" "}
            <a style={{ color: "teal" }}>{this.state.passwordResetUserName}</a>{" "}
            has been generated successfully. Use the following link to set the
            new password:
            <br />
            <div className={style.urlCopy}>
              <a style={{ color: "teal" }} href={this.state.recoveryLink}>
                {this.state.recoveryLink}
              </a>
              {copyable && (
                <Tooltip title={"Copy"} id="clip">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${this.state.recoveryLink}`
                      );
                    }}
                    aria-label="copy"
                  >
                    <FileCopyOutlined />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({
                  resetPasswordOpen: false,
                  passwordResetLink: null,
                  passwordResetUserName: null,
                })
              }
              id="resetPasswordOpen"
              color="accent"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, Projects, Groups }) => {
  const {
    users,
    roles,
    isAddUserSuccess,
    isEditUserSuccess,
    isUserResponseError,
    isActivateSuccess,
    isDeleteUserSucess,
    newUser,
    getUsersIsLoading,
  } = settings;
  const projectsList = Projects.projectsList.items;
  const { currentProject } = Projects;
  const { groupsList } = Groups;
  return {
    users,
    roles,
    isAddUserSuccess,
    isEditUserSuccess,
    isUserResponseError,
    isActivateSuccess,
    isDeleteUserSucess,
    newUser,
    projectsList,
    currentProject,
    groupsList,
    getUsersIsLoading,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    getUsers,
    getRoles,
    addUser,
    editUser,
    resetError,
    resetUserResponse,
    deleteUser,
    resetUserDeleteResponse,
    getGroups,
  })(UserList)
);
