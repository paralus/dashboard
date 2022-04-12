import http from "./Config";
import { getInitProjects } from "./Projects";
import { closeKubectlDrawer } from "./Kubectl";

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
    let url = "logout/";
    if (idle) {
      url = "logout/?idle";
    }
    http("auth")
      .get(url)
      .then((response) => {
        dispatch({ type: "reset_project" });
        dispatch({ type: "user_session_expired" });
        dispatch({ type: "reset_usersession" });
        dispatch(closeKubectlDrawer());
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

//TODO: uncomment below and remove mock method once login is available
/*
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
        if (error.response.status === 403) {
          dispatch({ type: "user_session_expired" });
        }
      });
  };
}
*/

//FIXME: This is mocking rafayops admin user, to be removed once login pr is raised
let userLoginMockText = '{ "roles":[ { "id":"dk3ropk", "group":{ "id":"w2l8lek", "name":"Organization Admins", "type":"DEFAULT_ADMINS", "organization_id":"699074c5-428e-4d2c-b596-687b3515b494", "partner_id":"rx28oml" }, "role":{ "id":"7w2lnkp", "name":"ADMIN", "is_global":true, "scope":"ORGANIZATION" }, "organization":{ "id":"699074c5-428e-4d2c-b596-687b3515b494", "name":"finmanorg", "is_totp_enabled":false, "approved":true, "active":true }, "partner":{ "id":"rx28oml", "name":"finman", "description":"Rafay Cloud Partner", "settings":{ "gslb_enabled":true, "signup_enabled":true, "salt_exec_enabled":true }, "host":"console.stage.rafay.dev", "domain":"run.stage.rafay-edge.net",  "tos_link":"", "logo_link":"", "notification_email":"notify-signups@rafay.co", "support_team_name":"Team Rafay", "partner_helpdesk_email":"support@rafay.co", "partner_product_name":"Rafay Systems", "ops_host":"ops.stage.rafay.dev", "fav_icon_link":"", "is_totp_enabled":false, "is_synthetic_partner_enabled":false }, "default":false, "active":true } ], "account":{ "id":"b2e4162c-60df-4fd7-b8fd-8fd3e4d6e533", "username":"nirav.parikh@infracloud.io", "user_type":"CONSOLE", "phone":"", "first_name":"Nirav", "last_name":"Parikh", "email_verified":true, "phone_verified":false, "require_change_password":false, "totp_verified":true, "last_login":"2022-03-14T08:46:30.828360Z", "require_email_verification":true }, "organization":{ "id":"699074c5-428e-4d2c-b596-687b3515b494", "name":"finmanorg", "description":"", "settings":{ "lockout_settings":{ "lockout_enabled":true, "lockout_period_min":15, "invalid_attempts_limit":3, "invalid_attempts_counter_period_min":5 }, "idle_time_logout_min":45 }, "billing_address":"", "active":true, "approved":true, "type":"free", "address_line1":"", "address_line2":"", "city":"", "state":"", "country":"", "partner_id":"rx28oml", "phone":"", "zipcode":"", "is_private":true, "is_totp_enabled":false, "published_workload_count":0, "psps_enabled":true, "custom_psps_enabled":true, "partner":{ "id":"rx28oml", "name":"finman", "description":"Rafay Cloud Partner", "settings":{ "gslb_enabled":true, "signup_enabled":true, "salt_exec_enabled":true }, "host":"console.stage.rafay.dev", "domain":"run.stage.rafay-edge.net", "tos_link":"", "logo_link":"", "notification_email":"notify-signups@rafay.co", "support_team_name":"Team Rafay", "partner_helpdesk_email":"support@rafay.co", "partner_product_name":"Rafay Systems", "ops_host":"ops.stage.rafay.dev", "fav_icon_link":"", "is_totp_enabled":false, "is_synthetic_partner_enabled":false }, "default_blueprints_enabled":false, "referer":null } }';
const userLoginMock = JSON.parse(userLoginMockText);
export function getUserSessionInfo() {
  return function (dispatch) {
    http("auth")
      .get("userinfo?metadata.name=opsadmin@rcloud.co")
      .then((response) => {
        dispatch({ type: "update_user_session", user: response.data });
        dispatch({ type: "user_login_success", payload: userLoginMock });
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: "get_user_failed", payload: error.response });
        dispatch({ type: "user_session_expired" });
        if (error.response.status === 403) {
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
