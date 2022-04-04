import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getRoles,
  createRole,
  removeRole,
  resetRole,
  resetRolesList,
} from "actions";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import { ValidatorForm } from "react-material-ui-form-validator";
import ResourceListTable from "./components/ResourceListTable";
import CreateResourceDialog from "./components/CreateResourceDialog";

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
};

class List extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      list: [],
      role: {
        metadata: {
          name: "",
          description: "",
        },
        spec: {
          scope: "PROJECT",
        },
      },
    };
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("regex", (value) => {
      const regex = /^[a-zA-Z]([-a-zA-Z0-9]*[a-zA-Z0-9])?$/;

      return regex.test(value);
    });
    ValidatorForm.addValidationRule("lowercaseonly", (value) => {
      const regex = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

      return regex.test(value);
    });
    const { getRoles } = this.props;
    getRoles();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { history, resetRole, list, isCreateSuccess, newRole, error } = props;
    if (isCreateSuccess && newRole) {
      resetRole();
      history.push(`/main/roles/${newRole.metadata.name}`);
    }
    if (list && list.length > 0) {
      newState.list = list;
    } else {
      newState.list = [];
    }

    if (props.isDeleteFailed && newState.deleteInitiated) {
      newState.deleteInitiated = false;
      newState.deleteError = props.error.message;
      newState.showError = true;
      resetRole();
    }
    if (props.isUpdateRoleError) {
      newState.deleteError = props.error.message;
      newState.showError = true;
      resetRole();
    }
    if (props.error) {
      newState.deleteError = props.error.message;
      newState.showError = true;
      resetRole();
    }
    return newState;
  }

  componentWillUnmount() {
    const { resetRolesList } = this.props;
    resetRolesList();
  }

  handleCreateClick = () => {
    this.setState({
      open: true,
    });
  };

  handleCreateClose = () => {
    this.setState({
      open: false,
    });
  };

  handleCreate = () => {
    const { role } = this.state;
    const { createRole } = this.props;
    this.handleCreateClose();
    createRole(role);
  };

  handleResourceChange = (name) => (event) => {
    const { role } = this.state;
    if (name === "name") {
      role.metadata.name = event.target.value;
    }
    if (name === "description") {
      role.metadata.description = event.target.value;
    }
    if (name === "scope") {
      role.spec.scope = event.value;
    }
    this.setState({
      role: {
        ...role,
      },
    });
  };

  handleRemoveRole = (id) => {
    const { removeRole } = this.props;
    const deleteInitiated = true;
    this.setState({ deleteInitiated }, removeRole(id));
  };

  handleResponseErrorClose = () => {
    this.setState({ showError: false, deleteError: null });
  };

  handleGoToManageRoles = (event, n) => {
    const { history } = this.props;
    history.push(`/main/roles/${n.metadata.name}`);
  };

  render() {
    let data = [];
    const { list, open, role, showError, deleteError } = this.state;
    const { history } = this.props;
    if (list) {
      data = list;
    }

    return (
      <div className="app-wrapper">
        <div>
          <h1
            className="p-0"
            style={{ marginBottom: "20px", color: "#ff9800" }}
          >
            Roles
          </h1>
          {data.length === 0 ? (
            <p style={style.helpText} className="pt-0">
              No roles available at this time
            </p>
          ) : (
            <p style={style.helpText} className="pt-0">
              Your roles are listed below
            </p>
          )}

          <ResourceListTable
            handleCreateClick={this.handleCreateClick}
            handleRemoveRole={this.handleRemoveRole}
            list={list}
            history={history}
            handleGoToManageRoles={this.handleGoToManageRoles}
          />
        </div>
        <CreateResourceDialog
          handleCreate={this.handleCreate}
          handleCreateClose={this.handleCreateClose}
          handleResourceChange={this.handleResourceChange}
          open={open}
          resource={role}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={showError}
          onClose={this.handleResponseErrorClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id",
          }}
          className="mb-3"
          message={deleteError}
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
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { roles } = settings;
  const {
    list,
    newRole,
    isDeleteSuccess,
    isDeleteFailed,
    isUpdateRoleError,
    isCreateSuccess,
    isAddRolePermissionError,
    error,
  } = roles;
  return {
    list,
    isCreateSuccess,
    isDeleteSuccess,
    isDeleteFailed,
    isUpdateRoleError,
    isAddRolePermissionError,
    error,
    newRole,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getRoles,
    createRole,
    removeRole,
    resetRole,
    resetRolesList,
  })(List)
);
