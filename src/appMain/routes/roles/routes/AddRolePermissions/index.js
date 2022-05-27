/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getRoleDetail,
  editRoleWithCallback,
  getRolePermissions,
  resetRolePermissions,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafaySnackbar from "components/RafaySnackbar";
import RafayPageHeader from "components/RafayPageHeader";
import TransferList from "./RafayTransferList/index";

class AddRolePermissions extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      list: [],
      roleId: props.match.params.role,
      roleName: props.match.params.role,
      addPermissionsList: [],
      removePermissionsList: [],
      showAlert: false,
      alertMessage: "",
    };
  }

  componentDidMount() {
    const { getRoleDetail, getRolePermissions, match } = this.props;
    getRolePermissions();
    getRoleDetail(match.params.role);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { roleDetail, permissions, resetRolePermissions } = props;
    if (roleDetail && permissions) {
      newState.roleName = roleDetail.metadata.name;
      if (roleDetail.spec.rolepermissions) {
        for (
          let indx = 0;
          indx < roleDetail.spec.rolepermissions.length;
          indx++
        ) {
          let permission = permissions.filter(function (ele) {
            return ele.metadata.name === roleDetail.spec.rolepermissions[indx];
          });
          newState.list.push(...permission);
        }
      }
    }

    if (props.isUpdateRoleError) {
      newState.deleteError = props.error.message;
      newState.showError = true;
      resetRolePermissions();
    }
    return {
      ...newState,
    };
  }

  handleCreateClose = () => {
    this.setState({
      open: false,
    });
  };

  handleCreate = () => {
    const { addPermissionsList, roleDetail } = this.state;
    const { editRoleWithCallback } = this.props;
    this.handleCreateClose();
    if (roleDetail.spec.rolepermissions) {
      roleDetail.spec.rolepermissions.push(...addPermissionsList);
    } else {
      roleDetail.spec.rolepermissions = addPermissionsList;
    }
    editRoleWithCallback(roleDetail, this.addPermissionSuccessCallback);
  };

  handleResourceChange = (id, index) => (event) => {
    const { addPermissionsList } = this.state;
    addPermissionsList[index] = { id: event.target.value };
    this.setState({
      addPermissionsList,
    });
  };

  handlePermissionAddMore = (event) => {
    let { addPermissionsList } = this.state;
    addPermissionsList = [...addPermissionsList, { id: "" }];
    this.setState({
      addPermissionsList,
    });
  };

  handlePermissionRemove = (index) => (event) => {
    const { addPermissionsList } = this.state;
    addPermissionsList.splice(index, 1);
    this.setState({
      addPermissionsList,
    });
  };

  handleAdded = (add) => {
    this.setState({ addPermissionsList: add });
  };

  handleRemoved = (rem) => {
    this.setState({ removePermissionsList: rem });
  };

  addPermissionSuccessCallback = () => {
    const { history } = this.props;
    const { roleId } = this.state;
    history.push(`/main/roles`);
  };

  handleFailureCallback = (message) => {
    this.setState({
      showError: true,
      deleteError: message,
    });
  };

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele != value;
    });
  };

  arrayObjectRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele.metadata.name != value;
    });
  };

  handleSaveChanges = () => {
    const { addPermissionsList, removePermissionsList, roleId } = this.state;
    const { roleDetail, addUsersToGroup, editRoleWithCallback } = this.props;
    if (addPermissionsList.length) {
      if (!roleDetail.spec.rolepermissions) {
        roleDetail.spec.rolepermissions = [];
      }
      addPermissionsList.forEach((permission) => {
        roleDetail.spec.rolepermissions.push(permission.metadata.name);
      });
    }
    if (removePermissionsList.length) {
      removePermissionsList.forEach((permission) => {
        roleDetail.spec.rolepermissions = this.arrayRemove(
          roleDetail.spec.rolepermissions,
          permission.metadata.name
        );
      });
    }
    roleDetail.spec.rolepermissions = [
      ...new Set(roleDetail.spec.rolepermissions),
    ];
    editRoleWithCallback(
      roleDetail,
      this.addPermissionSuccessCallback,
      this.handleFailureCallback
    );
  };

  render() {
    let rolePermissionsList = [];
    const { list, roleName, roleId, showError, deleteError } = this.state;
    const { permissions, roleDetail, drawerType } = this.props;
    if (list) {
      rolePermissionsList = list;
    }
    let allPermissions = [];
    if (permissions && roleDetail) {
      allPermissions = this.arrayObjectRemove(permissions, "ops_star.all");
      if (roleDetail.spec.scope.toLowerCase() != "namespace") {
        allPermissions = this.arrayObjectRemove(
          allPermissions,
          "kubectl.namespace.read"
        );
        allPermissions = this.arrayObjectRemove(
          allPermissions,
          "kubectl.namespace.write"
        );
      }
    }
    const config = {
      links: [
        {
          label: `Role`,
          href: "#/main/roles",
        },
        {
          label: `${roleName}`,
          href: `#/main/roles/${roleId}`,
        },
        {
          label: "Add/Remove Permissions",
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <RafayPageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="roles.add_permissions.layout.title"
            help="roles.add_permissions.layout.helptext"
          />
          <TransferList
            selectedList={rolePermissionsList}
            availableList={allPermissions}
            handleAdded={this.handleAdded}
            handleRemoved={this.handleRemoved}
          />
        </div>
        <Paper
          elevation={3}
          className="workload-detail-bottom-navigation"
          style={{ left: "26px" }}
        >
          <div className="row d-flex justify-content-between pt-3">
            <div className="d-flex flex-row">
              <div className="d-flex align-items-center">
                <Button
                  className="ml-0 bg-white text-red"
                  variant="contained"
                  color="default"
                  onClick={this.addPermissionSuccessCallback}
                  type="submit"
                >
                  Discard Changes &amp; Exit
                </Button>
              </div>
            </div>
            <div className="next d-flex align-items-center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSaveChanges}
                type="submit"
              >
                <span>Save &amp; Exit</span>
              </Button>
            </div>
          </div>
        </Paper>
        <RafaySnackbar
          open={showError}
          severity="error"
          message={deleteError}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { drawerType } = settings;
  const { isUpdateRoleError, roleDetail, error } = settings.roles;
  const permissions = settings.permissions.list;
  return {
    roleDetail,
    permissions,
    isUpdateRoleError,
    error,
    drawerType,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getRoleDetail,
    editRoleWithCallback,
    getRolePermissions,
    resetRolePermissions,
  })(AddRolePermissions)
);
