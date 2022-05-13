/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addUserWithCallback, getGroups } from "actions/index";
import { Button, Paper } from "@material-ui/core";
import RafaySnackbar from "components/RafaySnackbar";
import RafayConfirmDialog from "components/RafayConfirmDialog";
import GridLayout from "./components/GridLayout";
import Profile from "./components/Profile";
import SelectGroupList from "./components/AddToGroups/RafayTransferList/SelectGroupList";

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      user: {
        metadata: {
          name: "",
        },
        spec: {
          firstName: "",
          lastName: "",
          phone: "",
          groups: [],
          projectNamespaceRoles: [],
          console: true,
          programmatic: true,
          user_type: "CONSOLE",
        },
      },
      showAlert: false,
      alertMessage: "",
      checked: [],
      openConfirm: false,
    };
  }

  componentDidMount() {
    const { getGroups } = this.props;
    getGroups();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupsList } = props;
    if (groupsList && groupsList.length > 0) {
      newState.availableGroups = groupsList;
    } else {
      newState.availableGroups = [];
    }
    return {
      ...newState,
    };
  }

  handleAccountChange = (name) => (event) => {
    const { user } = this.state;
    const { value } = event.target;
    if (name === "username") {
      user.metadata.name = value;
      user.spec.name = value;
    }
    if (name === "first_name") {
      user.spec.firstName = value;
    }
    if (name === "last_name") {
      user.spec.lastName = value;
    }
    if (name === "phone") {
      user.spec.phone = value;
    }
    this.setState({ user });
  };

  handleSuccessCallback = (data) => {
    const { history } = this.props;
    history.push("/main/users");
  };

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  handleDiscardAndExit = () => {
    const { history } = this.props;
    history.push("/main/users");
  };

  handleProfileError = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
    });
  };

  handleAddUser = (_) => {
    const { user, availableGroups } = this.state;
    const { addUserWithCallback } = this.props;
    const postParams = { ...user };
    if (!user.spec.groups) {
      const defaultUsers = availableGroups.find(
        (g) => g.spec.type === "DEFAULT_USERS"
      );
      postParams.spec.groups = [defaultUsers.metadata.name];
    }

    addUserWithCallback(
      postParams,
      this.handleSuccessCallback,
      this.handleProfileError
    );
  };

  handleSaveClick = () => {
    const { user, availableGroups } = this.state;
    const postParams = { ...user };
    if (!user.spec.groups) {
      const defaultUsers = availableGroups.find(
        (g) => g.spec.type === "DEFAULT_USERS"
      );
      postParams.spec.groups = [defaultUsers.metadata.name];
    }
    if (postParams.spec.groups.length === 1) {
      this.setState({ openConfirm: true });
      return;
    }
    this.handleAddUser();
  };

  handleChecked = (checked) => {
    const { user } = this.state;
    const groups = checked.map((g) => g.metadata.name);
    this.setState({
      user: {
        ...user,
        spec: {
          ...user.spec,
          groups: groups,
        },
      },
    });
  };

  handleConfirmSave = (_) => {
    this.setState({ openConfirm: false }, (_) => this.handleAddUser());
  };

  handleUserType = (event) => {
    this.setState({ ...this.state });
  };

  render() {
    const {
      currentTab,
      user,
      showAlert,
      alertMessage,
      availableGroups,
      openConfirm,
    } = this.state;
    const { drawerType } = this.props;
    const selectedGroups = [];
    if (availableGroups && availableGroups.length > 0) {
      const defaultUsers = availableGroups.find(
        (g) => g.spec.type === "DEFAULT_USERS"
      );
      if (defaultUsers) {
        selectedGroups.push(defaultUsers);
      }
    }
    return (
      <>
        <GridLayout
          rightTitle="Groups"
          leftTitle="Groups"
          leftView={
            <Profile
              user={user}
              handleAccountChange={this.handleAccountChange}
              drawerType={drawerType}
              onDiscardAndExit={this.handleDiscardAndExit}
              onSaveProfile={this.handleSaveClick}
            />
          }
          rightView={
            <SelectGroupList
              selectedList={selectedGroups}
              availableList={availableGroups}
              // handleAdded={this.handleAdded}
              handleChecked={this.handleChecked}
              // handleRemoved={this.handleRemoved}
            />
          }
        />
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
                  onClick={this.handleDiscardAndExit}
                  type="button"
                >
                  <span>Discard &amp; Exit</span>
                </Button>
              </div>
            </div>
            <div className="next d-flex align-items-center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSaveClick}
                type="submit"
              >
                <span>Save &amp; Exit</span>
              </Button>
            </div>
          </div>
        </Paper>
        <RafaySnackbar
          open={showAlert}
          severity="error"
          message={alertMessage}
          closeCallback={this.handleResponseErrorClose}
        />
        <RafayConfirmDialog
          open={openConfirm}
          content="The user has not been assigned to any groups and will not have access to any resources. Are you sure you want to continue?"
          onClose={(_) => this.setState({ openConfirm: false })}
          onConfirm={this.handleConfirmSave}
        />
      </>
    );
  }
}

const mapStateToProps = ({ Users, settings, Groups }) => {
  const { user } = Users;
  const { groupsList } = Groups;
  const { drawerType } = settings;
  return {
    user,
    groupsList,
    drawerType,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    addUserWithCallback,
    getGroups,
  })(NewUser)
);
