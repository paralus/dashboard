import http from "./Config";
import { getInitProjects } from "./Projects";
import { closeKubectlDrawer } from "./Kubectl";
import { Configuration, V0alpha2Api } from "@ory/kratos-client";

export function userSignup(user) {
  return function (dispatch) {
    http("auth")
      .post("signup/", { ...user })
      .then((response) => {
        dispatch({ type: "user_signup_success", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "user_signup_error",
          payload: error.response.data,
        });
      });
  };
}

export const newKratosSdk = () => {
  return new V0alpha2Api(
    new Configuration({
      basePath: window.env?.KRATOS_URL || `//${window.location.host}`,
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
        withCredentials: true,

        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    ""
    // Ensure that we are using the axios client with retry.
    // axios
  );
};

export function userLogin(user) {
  return function (dispatch) {
    http("auth")
      .post("login/", { ...user })
      .then((response) => {
        if (
          response.data &&
          response.data.account &&
          response.data.account.totp_required
        ) {
          dispatch({
            type: "user_login_totp_required",
            payload: response.data.account,
          });
        } else {
          if (response.data.roles) {
            dispatch({ type: "set_user_session", user: response.data });
          }
          dispatch({ type: "user_login_success", payload: response });
          dispatch(getInitProjects());
        }
      })
      .catch((error) => {
        dispatch({
          type: "user_login_error",
          payload: error.response.data,
        });
      });
  };
}

export function userLogout(idle) {
  return function (dispatch) {
    newKratosSdk()
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data: logoutUrl }) => {
        dispatch({ type: "reset_project" });
        dispatch({ type: "user_session_expired" });
        dispatch({ type: "reset_usersession" });
        dispatch(closeKubectlDrawer());
        newKratosSdk()
          .submitSelfServiceLogoutFlow(logoutUrl.logout_token)
          .catch((error) => {
            console.error(error);
            dispatch({ type: "user_session_expired", payload: error });
          });
      })
      .catch((error) => {
        dispatch({ type: "user_session_expired", payload: error });
      });
  };
}

export function forgotPassword(user) {
  return function (dispatch) {
    http("auth")
      .post("password_reset/", { ...user })
      .then((response) => {
        dispatch({
          type: "user_forgotpassword_success",
          payload: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: "user_forgotpassword_error",
          payload: error.response.data,
        });
      });
  };
}

export function setPassword(params) {
  return function (dispatch) {
    http("auth")
      .post(`reset/${params.accountid}/${params.token}/`, params)
      .then((response) => {
        dispatch({
          type: "user_setpassword_success",
          payload: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: "user_setpassword_error",
          payload: error.response.data,
        });
      });
  };
}

export function getUserSessionInfo() {
  return function (dispatch) {
    http("auth")
      .get("userinfo")
      .then((response) => {
        dispatch({ type: "update_user_session", user: response.data });
        dispatch({ type: "user_login_success", payload: response });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: "get_user_failed", payload: error.response });
        dispatch({ type: "user_session_expired" });
        if (error.response?.status === 403) {
          dispatch({ type: "user_session_expired" });
        }
      });
  };
}

export function changePassword(params) {
  return function (dispatch) {
    http("auth")
      .post(`users/${params.accountid}/change_password/`, params)
      .then((response) => {
        dispatch({ type: "user_session_expired", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "user_changepassword_error",
          payload: error.response.data,
        });
      });
  };
}

export function resendVerificationEmail(user) {
  return function (dispatch) {
    http("auth")
      .post("send_verification_email/", user)
      .then((response) => {
        dispatch({
          type: "send_email_verification_success",
          payload: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: "send_email_verification_error",
          payload: error.response.data,
        });
      });
  };
}

export function reloadApp() {
  return { type: "reload_app" };
}

export function organizationLogin(organization) {
  return function (dispatch) {
    dispatch({ type: "reset_redux_state" });
    http("auth")
      .post("login/organization/", { ...organization })
      .then((response) => {
        dispatch({ type: "user_changeorg_success", payload: response });
        window.localStorage.setItem("org_changed", "ORG_CHANGED");
        dispatch(reloadApp());
      })
      .catch((error) => {
        if (error.response.status === 403) {
          dispatch({ type: "user_session_expired" });
        } else {
          dispatch({
            type: "user_login_error",
            payload: error.response.data,
          });
        }
      });
  };
}

export function verifySignup(params) {
  return function (dispatch) {
    http("auth")
      .get(`signup/${params.accountid}/verify/${params.token}/`)
      .then((response) => {
        dispatch({ type: "signup_verify_success", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "signup_verify_error",
          payload: error.response.data,
        });
      });
  };
}

export function getRafayCliDownloadOptions() {
  return function (dispatch) {
    http("auth")
      .get(`cli/download/`)
      .then((response) => {
        dispatch({
          type: "cli_download_options_success",
          payload: response,
        });
      })
      .catch((error) => {
        dispatch({
          type: "cli_download_options_error",
          payload: error.response.data,
        });
      });
  };
}

export function resetLoginError() {
  return { type: "user_login_error_reset" };
}

export function resetSignupError() {
  return { type: "user_signup_error_reset" };
}

export function resetForgotpasswordError() {
  return { type: "user_forgotpassword_error_reset" };
}

export function resetPasswordError() {
  return { type: "user_setpassword_error_reset" };
}

export function resetResendSignupEmail() {
  return { type: "user_signup_resend_reset" };
}

export function resetCliDownload() {
  return { type: "cli_download_reset" };
}
