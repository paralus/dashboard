import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Paper } from "@material-ui/core";
import {
  editUserWithCallback,
  getKubeconfigValidity,
  setKubeconfigValidity,
} from "actions/index";
import AppSnackbar from "components/AppSnackbar";
import Profile from "./components/Profile";
import KubeconfigValidity from "./components/KubeconfigValidity";
import { capitalizeFirstLetter } from "../../../../../utils";

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      showAlert: false,
      alertMessage: "",
      alertSeverity: "error",
      isSaveDisabled: true,
      refAccount: null,
      kubectlSettings: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { user } = props;
    let refAccount = {};
    if (user && user.account) {
      refAccount = { ...user.account };
    }
    if (user && !state.user) {
      return {
        ...state,
        user,
        refAccount,
      };
    }

    return state;
  }

  componentDidMount() {
    const { match } = this.props;
    const userId = match.params.userId;
    if (userId) {
      getKubeconfigValidity(userId).then((res) => {
        this.setState({
          kubectlSettings: res?.data,
        });
      });
    }
  }

  handleAccountChange = (name) => (event) => {
    const { user, refAccount } = this.state;
    const { value } = event.target;
    let isSaveDisabled = true;
    user.account[name] = value;
    if (value !== refAccount[name]) {
      isSaveDisabled = false;
    }
    this.setState({ user, isSaveDisabled: false });
  };

  handleSuccessCallback = (data) => {
    this.setState({ isSaveDisabled: true });
  };

  handleProfileError = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
      alertSeverity: "error",
    });
  };

  handleSaveProfile = () => {
    const { user } = this.state;
    const { editUserWithCallback } = this.props;

    editUserWithCallback(
      user,
      this.handleSuccessCallback,
      this.handleProfileError
    );
  };

  handleSaveValidity = (kubectlSettings) => {
    const { match } = this.props;
    const userId = match.params.userId;
    if (userId) {
      return setKubeconfigValidity(userId, kubectlSettings);
    }
    throw Error("Unknown Error");
  };

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  render() {
    const {
      user,
      showAlert,
      alertMessage,
      alertSeverity,
      isSaveDisabled,
      kubectlSettings,
    } = this.state;
    if (!user) {
      return null;
    }
    return (
      <>
        <div className="mb-3">
          <Paper className="col-md-6 p-0">
            <Profile
              user={user}
              handleAccountChange={this.handleAccountChange}
            />
            <div
              className="p-3 mt-2 d-flex flex-row-reverse"
              style={{ borderTop: "1px solid lightgray" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSaveProfile}
                type="submit"
                disabled={isSaveDisabled}
              >
                <span>Save</span>
              </Button>
            </div>
          </Paper>
        </div>
        <div>
          <KubeconfigValidity
            settings={kubectlSettings}
            onSave={this.handleSaveValidity}
          />
        </div>
        <AppSnackbar
          open={showAlert}
          severity={alertSeverity}
          message={capitalizeFirstLetter(alertMessage)}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

export default withRouter(
  connect(null, {
    editUserWithCallback,
    setKubeconfigValidity,
  })(UserProfile)
);
