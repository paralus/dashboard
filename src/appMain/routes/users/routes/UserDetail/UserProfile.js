import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Paper } from "@material-ui/core";
import {
  editUserWithCallback,
  getKubeconfigValidity,
  setKubeconfigValidity,
} from "actions/index";
import RafaySnackbar from "components/RafaySnackbar";
import Profile from "./components/Profile";
import KubeconfigValidity from "./components/KubeconfigValidity";

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
    if (user) {
      refAccount = user;
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
    const { user, match } = this.props;
    const userId = match.params.userId;
    if (userId && user) {
      getKubeconfigValidity(user.metadata.id).then((res) => {
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
    if (name === "first_name") {
      user.spec.firstName = value;
      if (value !== refAccount.spec.firstName) {
        isSaveDisabled = false;
      }
    }
    if (name === "last_name") {
      user.spec.lastName = value;
      if (value !== refAccount.spec.lastName) {
        isSaveDisabled = false;
      }
    }
    if (name === "phone") {
      user.spec.phone = value;
      if (value !== refAccount.spec.phone) {
        isSaveDisabled = false;
      }
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
    const { user, match } = this.props;
    const userId = match.params.userId;
    if (userId && user) {
      return setKubeconfigValidity(user.metadata.id, kubectlSettings);
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

        <RafaySnackbar
          open={showAlert}
          severity={alertSeverity}
          message={alertMessage}
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
