import {
  Divider,
  FormControl,
  FormControlLabel,
  Input,
  InputAdornment,
  InputLabel,
  LinearProgress,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Visibility from "@material-ui/icons/Visibility";
import {
  resetLoginError,
  resetPasswordError,
  setPassword,
  userLogin,
  getUserSessionInfo,
  initializeApp,
} from "actions/index";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import ChangePasswordForm from "./components/ChangePasswordForm";
import { newKratosSdk } from "../../../actions/Auth";
import paraluslogo from "../../../assets/images/logolarge.png";

const SESSION_TIMEOUT_MILLISECONDS = 12 * 60 * 60 * 1000 + 1 * 60 * 1000; // 12hrs + 1min
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      showPassword: false,
      isResponseError: false,
      current_password: "",
      new_password: "",
      confirm_password: "",
      isChangePasswordError: false,
      change_password: {},
      redirectToLogin: false,
      logintype: undefined,
      usertype: "internal",
      loading: false,
      showRadioBtns: false,
      redirectUrl: undefined,
      isPreLoginError: false,
      flow: {},
      nodes: [],
      csrf_token: undefined,
    };
    this.emailNode = null;
    this.new_password_node = null;
    this.confirm_password_node = null;
  }

  // initializeFlow = () =>
  //   newKratosSdk()
  //     .initializeSelfServiceLoginFlowForBrowsers(true, "aal1")
  //     .then((response) => {
  //       const { data: flow } = response;
  //       flow.ui.nodes.forEach((node) => {
  //         if (node.attributes.name === "csrf_token") {
  //           this.setState({ csrf_token: node.attributes.value });
  //         }
  //         if (node.group === "oidc") {
  //           this.setState({
  //             nodes: [
  //               ...this.state.nodes,
  //               {
  //                 ...node.meta?.label,
  //                 provider: node.meta.label.context.provider,
  //               },
  //             ],
  //           });
  //         }
  //       });
  //       this.setState({
  //         flow,
  //       });
  //     })
  //     .catch(console.error);

  initializeFlow = () =>
    newKratosSdk()
      .createBrowserLoginFlow({ refresh: true, aal: "2" })
      .then((response) => {
        const { data: flow } = response;
        flow.ui.nodes.forEach((node) => {
          if (node.attributes.name === "csrf_token") {
            this.setState({ csrf_token: node.attributes.value });
          }
          if (node.group === "oidc") {
            this.setState({
              nodes: [
                ...this.state.nodes,
                {
                  ...node.meta?.label,
                  provider: node.meta.label.context.provider,
                },
              ],
            });
          }
        });
        this.setState({
          flow,
        });
      })
      .catch(console.error);

  UNSAFE_componentWillMount() {
    const rememberMe = window.localStorage.getItem("rememberMe");
    if (rememberMe) {
      const meta = JSON.parse(rememberMe);
      if (meta.checked) {
        this.setState({
          usertype: meta.usertype,
          username: meta.username,
          redirectUrl: meta.redirectUrl,
        });
      }
    }
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      return value === this.state.change_password.password;
    });
    ValidatorForm.addValidationRule("passwordLength", (value) => {
      return this.state.change_password.password.length >= 8;
    });
    this.initializeFlow();
    this.props.getUserSessionInfo();
  }

  // A small function to help us deal with errors coming from fetching a flow.
  handleFlowError(err) {
    switch (err.response?.data.error?.id) {
      case "session_aal2_required":
        // 2FA is enabled and enforced, but user did not perform 2fa yet!
        window.location.href = err.response?.data.redirect_browser_to;
        return;
      case "session_already_available":
        // User is already signed in, let's redirect them home!
        this.props.history.push("/main");
        return;
      case "session_refresh_required":
        // We need to re-authenticate to perform this action
        window.location.href = err.response?.data.redirect_browser_to;
        return;
      case "self_service_flow_return_to_forbidden":
        // The flow expired, let's request a new one.
        alert("The return_to address is not allowed.");
        this.props.history.push("/#/reload");
        return;
      case "self_service_flow_expired":
        // The flow expired, let's request a new one.
        alert("Your interaction expired, please fill out the form again.");
        this.props.history.push("/#/reload");
        return;
      case "security_csrf_violation":
        // A CSRF violation occurred. Best to just refresh the flow!
        alert(
          "A security violation was detected, please fill out the form again."
        );
        this.props.history.push("/#/reload");
        return;
      case "security_identity_mismatch":
        // The requested item was intended for someone else. Let's request a new flow...
        this.props.history.push("/#/reload");
        return;
      case "browser_location_change_required":
        // Ory Kratos asked us to point the user to this URL.
        window.location.href = err.response.data.redirect_browser_to;
        return;
    }

    switch (err.response?.status) {
      case 410:
        // The flow expired, let's request a new one.
        this.props.history.push("/");
        return;
      case 400:
        // bad user credentials, alert user and request for retry.
        alert(err.response?.data?.ui?.messages[0]?.text);
        return;
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (
      props.isLoginFailed ||
      props.isSetPasswordFailed ||
      (props.auth && props.auth.error)
    ) {
      this.state.isResponseError = true;
    } else {
      this.state.isResponseError = false;
    }
    this.setState({ ...this.state });
  }

  getErrorMessage = () => {
    if (!this.props.auth.error) {
      return null;
    }
    return (
      <span id="message-id">
        <ul className="list-group">
          {this.props.auth.error &&
            this.props.auth.error.details.map((li, index) => (
              <li
                className="list-group-item"
                key={li}
                style={{
                  backgroundColor: "transparent",
                  border: "transparent",
                }}
              >
                {li.detail}
                {li.info && <span>. {li.info}</span>}
              </li>
            ))}
        </ul>
      </span>
    );
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleChange = (name) => (event) => {
    this.state[name] = event.target.value;
    this.setState({ ...this.state });
  };

  handleBlur = (event) => {
    if (this.emailNode) {
      this.emailNode.validate(event.target.value);
    }
  };

  handleSubmit = () => {
    const { auth } = this.props;
    const { username, flow } = this.state;
    auth.username = username;

    // newKratosSdk()
    //   .submitSelfServiceLoginFlow(flow.id, {
    //     csrf_token: this.state.csrf_token,
    //     method: "password",
    //     password_identifier: this.state.username,
    //     password: this.state.password,
    //   })
    //   .then(() => {
    //     // const { initializeApp } = this.props;
    //     /*
    //     initializeApp(() => {
    //     });
    //     */
    //     window.location.href = "/";
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     this.handleFlowError(err);
    //   });

    newKratosSdk()
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          method: "password",
          csrf_token: this.state.csrf_token,
          password_identifier: this.state.username,
          password: this.state.password,
        },
      })
      .then(() => {
        // const { initializeApp } = this.props;
        /*
        initializeApp(() => {
        });
        */
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
        this.handleFlowError(err);
      });
  };

  handleOIDC = (provider) => {
    const { auth } = this.props;
    const { username, flow } = this.state;
    auth.username = username;

    window.localStorage.setItem("provider", provider);
    // newKratosSdk()
    //   .submitSelfServiceLoginFlow(flow.id, {
    //     csrf_token: this.state.csrf_token,
    //     method: "oidc",
    //     provider,
    //   })
    //   .catch((err) => {
    //     this.handleFlowError(err);
    //   })
    //   .then((res) => {
    //     initializeApp(() => {
    //       window.location.href = res.data.redirect_browser_to;
    //     });
    //   });

    newKratosSdk()
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          csrf_token: this.state.csrf_token,
          method: "oidc",
          provider,
        },
      })
      .catch((err) => {
        this.handleFlowError(err);
      })
      .then((res) => {
        initializeApp(() => {
          window.location.href = res.data.redirect_browser_to;
        });
      });
  };

  handleResponseErrorClose = () => {
    this.props.resetLoginError();
    this.setState({
      ...this.state,
      isResponseError: false,
    });
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter" && this.state.usertype !== undefined) {
    }

    if (event.key === "Enter" && this.state.usertype) {
      this.handleSubmit();
    }
  };

  changeUser = (e) => {
    e.preventDefault();
    this.setState({ usertype: undefined, username: "" });
  };

  handleRememberClick = (e) => {
    this.setState({ rememberMe: e.target.checked });
  };

  renderLoginForm() {
    const { username, showPassword, password } = this.state;
    const { partnerDetail } = this.props;
    return (
      <>
        <>
          <img
            src={paraluslogo}
            alt="logo"
            className="login-logo img-fluid mb-4"
          />
          <ValidatorForm onSubmit={this.handleSubmit} instantValidate={false}>
            <fieldset>
              <div style={{ marginTop: "25px", marginBottom: "25px" }}>
                {this.state.usertype !== undefined ? (
                  <TextValidator
                    id="email"
                    label="Email"
                    name="email"
                    ref={(node) => {
                      this.emailNode = node;
                    }}
                    fullWidth
                    value={username}
                    onBlur={this.handleBlur.bind(this)}
                    onChange={this.handleChange("username").bind(this)}
                    onKeyPress={this.handleKeyPress}
                    margin="normal"
                    className="mt-0"
                    validators={["required", "isEmail"]}
                    errorMessages={[
                      "this field is required",
                      "email is not valid",
                    ]}
                  />
                ) : (
                  <TextValidator
                    id="email"
                    label="Email"
                    name="email"
                    ref={(node) => {
                      this.emailNode = node;
                    }}
                    fullWidth
                    value={username}
                    onBlur={this.handleBlur.bind(this)}
                    onChange={this.handleChange("username").bind(this)}
                    onKeyPress={this.handleKeyPress}
                    margin="normal"
                    className="mt-0"
                    validators={["required", "isEmail"]}
                    errorMessages={[
                      "this field is required",
                      "email is not valid",
                    ]}
                  />
                )}
                {this.state.usertype === "internal" ? (
                  <div className="animated slideInRightTiny animation-duration-3 mb-3">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel htmlFor="adornment-password">
                        Password
                      </InputLabel>
                      <Input
                        id="password"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={this.handleChange("password").bind(this)}
                        onKeyPress={this.handleKeyPress}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={this.handleClickShowPassword}
                              onMouseDown={this.handleMouseDownPassword}
                            >
                              {this.state.showPassword ? (
                                <Visibility
                                  style={{
                                    color: "00bcd4",
                                  }}
                                />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </div>
                ) : null}
                {this.state.usertype === "both" ? (
                  <div className="animated slideInRightTiny animation-duration-3 mt-4">
                    <Button
                      style={{
                        marginBottom: 10,
                        marginTop: 10,
                        width: 208,
                        marginRight: -1,
                      }}
                      href={this.state.redirectUrl}
                      variant="contained"
                      className="jr-btn text-white"
                      color="primary"
                    >
                      Login With SSO
                    </Button>
                    <br />
                    <Button
                      variant="contained"
                      className="jr-btn text-white"
                      color="primary"
                      onClick={() => this.setState({ usertype: "internal" })}
                    >
                      Login With Password
                    </Button>
                  </div>
                ) : null}
                {this.state.usertype === "external" ? (
                  <div className="animated slideInRightTiny animation-duration-3 mt-4">
                    <Button
                      style={{
                        marginBottom: 10,
                      }}
                      href={this.state.redirectUrl}
                      variant="contained"
                      className="jr-btn text-white"
                      color="primary"
                    >
                      Login With SSO
                    </Button>
                  </div>
                ) : null}

                <div className="mt-1 mb-4 d-flex justify-content-between align-items-center">
                  {this.state.usertype === undefined && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="gilad"
                          color="primary"
                          onClick={this.handleRememberClick}
                        />
                      }
                      label="Remember me"
                    />
                  )}
                </div>
              </div>
              <div className="my-4 py-4">
                <div
                  className={`d-flex ${
                    [undefined, "internal"].includes(this.state.usertype)
                      ? "justify-content-between"
                      : "justify-content-center"
                  } align-items-center`}
                >
                  <div></div>
                  <div>
                    {this.state.usertype === undefined ||
                    this.state.usertype === "internal" ? (
                      <Button
                        variant="contained"
                        className="jr-btn text-white"
                        color="primary"
                        onClick={this.handleSubmit}
                      >
                        Login
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div style={{ marginTop: "25px" }}>
                  {[...this.state.nodes].map((uiNode, i) => (
                    <Button
                      style={{
                        marginBottom: 10,
                      }}
                      onClick={() => this.handleOIDC(uiNode.context.provider)}
                      variant="contained"
                      className="jr-btn text-white"
                      color="primary"
                      key={`login-node-{i}`}
                    >
                      {uiNode.text}
                    </Button>
                  ))}
                </div>
              </div>
              {this.state.loading ? <LinearProgress /> : null}
              {this.state.usertype === undefined &&
                partnerDetail?.settings?.signup_enabled && (
                  <div
                    className="pt-3 pb-3 mb-3"
                    // style={{ border: "1px solid #009688", borderRadius: "5px" }}
                    style={{
                      background: "rgb(222, 243, 241)",
                      borderRadius: "5px",
                    }}
                  >
                    <div className="mb-2">Don' t have an account ?</div>
                    <Button
                      color="primary"
                      onClick={(_) => this.props.history.push("/signup")}
                      variant="outlined"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
            </fieldset>
          </ValidatorForm>
        </>
      </>
    );
  }

  render() {
    const { partnerDetail, isLoginSuccess, userAndRoleDetail, UserSession } =
      this.props;
    const { isResponseError } = this.state;

    let formContent = this.renderLoginForm();

    if (isLoginSuccess) {
      if (userAndRoleDetail?.account?.require_change_password) {
        this.state.password = "";
        // formContent = this.renderChangePasswordForm();
        formContent = (
          <ChangePasswordForm
            isChangePasswordError={this.props.isChangePasswordError}
            auth={this.props.auth}
            change_password={this.state.change_password}
            handleChangePassword={this.handleChangePassword}
            handlePasswordChangeAttributes={this.handlePasswordChangeAttributes}
          />
        );
      }
      // Make an API call after 12hrs(+1min) which will trigger user session expiry
      setTimeout(
        this.props.getUserSessionInfo.bind(this),
        SESSION_TIMEOUT_MILLISECONDS
      );
      if (UserSession.noRolesUser) {
        return <Redirect to="/app/noaccess" />;
      }
      return <Redirect to="/main" />;
    }

    return (
      <>
        <PageLayout partnerDetail={partnerDetail}>{formContent}</PageLayout>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isResponseError}
          onClose={this.handleResponseErrorClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id",
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
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.isPreLoginError}
          onClose={() => this.setState({ isPreLoginError: false })}
          SnackbarContentProps={{
            "aria-describedby": "message-id",
          }}
          className="mb-3"
          message={
            this.state.errorMessage
              ? this.state.errorMessage
              : "Something went wrong!"
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.setState({ isPreLoginError: false })}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </>
    );
  }
}

const mapStateToProps = ({ settings, UserSession, Projects }) => {
  const {
    isLoginSuccess,
    isLoginFailed,
    partnerDetail,
    auth,
    userAndRoleDetail,
    isSetPasswordSuccess,
    isSetPasswordFailed,
    isTotpRequired,
    isTotpVerified,
    totpUrl,
  } = settings;
  const { currentProject } = Projects;
  return {
    isLoginSuccess,
    isLoginFailed,
    partnerDetail,
    auth,
    userAndRoleDetail,
    isSetPasswordSuccess,
    isSetPasswordFailed,
    isTotpRequired,
    isTotpVerified,
    totpUrl,
    UserSession,
    currentProject,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    userLogin,
    resetLoginError,
    setPassword,
    resetPasswordError,
    getUserSessionInfo,
    initializeApp,
  })(Login)
);
