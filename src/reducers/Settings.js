import {
  DRAWER_TYPE,
  FIXED_DRAWER,
  THEME_COLOR,
  TOGGLE_COLLAPSED_NAV,
} from "constants/ActionTypes";
import { DARK_INDIGO } from "constants/Constant";
import Cookies from "js-cookie";

const initialSettings = {
  navCollapsed: false,
  drawerType: FIXED_DRAWER,
  themeColor: DARK_INDIGO,
  isSignupSuccess: false,
  isSignupFailed: false,
  partnerData: null,
  isLoginSuccess: false,
  isLoginFailed: false,
  reloadApp: false,
  edges: {
    list: null,
    detail: null,
    isAddEdgeSuccess: false,
    isUpdateEdgeSuccess: false,
    isDeleteEdgeSuccess: false,
    isEdgesResponseError: false,
    getKubectlConfigSuccess: false,
    downloadKubectlConfigReady: false,
    kubectlConfig: "",
    error: null,
    downloadYAML: null,
  },
  users: {
    list: null,
    isAddUserSuccess: false,
    error: null,
    isUserResponseError: false,
    rowsPerPage: 5,
    offset: 0,
    page: 0,
  },
  roles: {
    list: null,
    newRole: null,
    isDeleteSuccess: false,
    isDeleteFailed: false,
    isUpdateRoleError: false,
    isCreateSuccess: false,
    isAddRolePermissionError: false,
    error: null,
    roleDetail: null,
    loading: false,
  },
  permissions: {
    list: null,
    loading: false,
  },
  organization: {
    detail: null,
    isOrganizationSaved: false,
    loading: false,
    error: null,
  },
  auth: {
    email_verification_attempts_pending: 3,
    error: null,
  },
  isAddUserSuccess1: false,
  isGetUserDataSuccess: false,
  isGetUserDataFailed: false,
  account: null,
  isSessionExpired: "UNKNOWN",
  partnerDetail: null,
  userAndRoleDetail: null,
  userRole: {
    isSuperAdmin: false,
    isPartnerAdmin: false,
    isOrgAdmin: false,
  },
  isUserResponseError: false,
  metroList: null,
  isLocationError: false,
  locationError: null,
  isLocationCreateSuccess: false,
  isLocationEditSuccess: false,
  istemplateCreateInitiated: false,
  isChangePasswordError: false,
  lang: "english",
  namespace: "",
  Wid: null,
  time_stamp: "10m",
  dyna_configs: {
    results: [],
  },
  dyna_config_mappings: {},
  totpUrl: "",
  totpVerifySuccess: false,
  isTotpRequired: false,
  isTotpVerified: false,
  download_index: 0,
};

const is_super_or_partner_admin = (data) => {
  const userRole = {
    isSuperAdmin: false,
    isPartnerAdmin: false,
    isOrgAdmin: false,
  };
  // NOTE: determine admin user here
  if (data && data.spec.permissions && data.spec.permissions.length > 0) {
    for (let index = 0; index < data.spec.permissions.length; index++) {
      const element = data.spec.permissions[index];
      if (element.role === "ADMIN") userRole.isOrgAdmin = true;
      if (element.role === "SUPER_ADMIN") {
        userRole.isSuperAdmin = true;
        break;
      }
    }
  }
  return userRole;
};

const changeValuePosition = (array) => {
  if (!array) {
    return [];
  }
  const from = array.findIndex((x) => x.name === "ADMIN_READ_ONLY");
  array.splice(1, 0, ...array.splice(from));
  return array;
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case "@@router/LOCATION_CHANGE":
      return {
        ...state,
        navCollapsed: false,
      };
    case TOGGLE_COLLAPSED_NAV:
      return {
        ...state,
        navCollapsed: action.isNavCollapsed,
      };
    case DRAWER_TYPE:
      return {
        ...state,
        drawerType: action.drawerType,
      };
    case THEME_COLOR:
      return {
        ...state,
        themeColor: action.color,
      };
    case "user_signup_success":
      return {
        ...state,
        isSignupSuccess: true,
        partnerData: action.payload.data,
      };
    case "user_signup_error":
      state.auth.error = action.payload;
      state.isSignupFailed = true;
      return { ...state };
    case "user_signup_error_reset":
      state.auth.error = null;
      state.isSignupFailed = false;
      return { ...state };
    case "user_login_success":
      return {
        ...state,
        userAndRoleDetail: action.payload.data,
        userRole: is_super_or_partner_admin(action.payload.data),
        isLoginSuccess: true,
        isSessionExpired: false,
        isTotpRequired: false,
      };
    case "user_login_totp_required":
      return {
        ...state,
        isTotpRequired: true,
        isTotpVerified: action.payload.totp_verified,
        totpUrl: action.payload.totp_url,
      };
    case "user_changeorg_success":
      state.userAndRoleDetail = action.payload.data;
      return {
        ...state,
        isChangeOrgSuccess: true,
      };
    case "user_login_error":
      state.auth.error = action.payload;
      state.isLoginFailed = true;
      return { ...state };
    case "user_login_error_reset":
      state.auth.error = null;
      state.isLoginFailed = false;
      state.isSetPasswordFailed = false;
      state.isSetPasswordSuccess = false;
      return { ...state };
    case "get_cli_detail_success":
      state.cliDetail = action.payload.data;
      return { ...state };
    case "organization_update_success":
      state.organization.isOrganizationSaved = true;
      state.organization.detail = action.payload;
      return {
        ...state,
      };
    case "organization_update_sucess_reset":
      state.organization.isOrganizationSaved = false;
      return {
        ...state,
      };
    case "get_edges_success":
      return {
        ...state,
        edges: {
          ...state.edges,
          list: action.payload.data.items,
          isAddEdgeSuccess: false,
          isDeleteEdgeSuccess: false,
          isUpdateEdgeSuccess: false,
          isEdgesResponseError: false,
          error: null,
        },
      };
    case "get_edges_error":
      return {
        ...state,
        edges: {
          ...state.edges,
          list: [],
          isAddEdgeSuccess: false,
          isDeleteEdgeSuccess: false,
          isUpdateEdgeSuccess: false,
        },
      };
    case "get_edge_detail_success":
      return {
        ...state,
        edges: {
          ...state.edges,
          detail: action.payload.data,
          list: null,
          isAddEdgeSuccess: false,
          isUpdateEdgeSuccess: false,
          isDeleteEdgeSuccess: false,
          isStopCapacitySuccess: false,
          isStartCapacitySuccess: false,
          isRebootCapacitySuccess: false,
          isApproveNodeSuccess: false,
          isEdgesResponseError: false,
          error: null,
        },
      };
    case "get_edge_detail_error":
      return {
        ...state,
        edges: {
          ...state.edges,
          detail: null,
          isAddEdgeSuccess: false,
          isUpdateEdgeSuccess: false,
          error: action.payload,
        },
      };
    case "add_edge_reset":
      return {
        ...state,
        edges: {
          ...state.edges,
          detail: null,
          isAddEdgeSuccess: false,
          downloadYAML: null,
        },
      };
    case "edge_update_success":
      return {
        ...state,
        edges: {
          ...state.edges,
          detail: action.payload.data,
          isEdgesResponseError: false,
          isUpdateEdgeSuccess: true,
          error: null,
        },
      };
    case "edge_update_error":
      return {
        ...state,
        edges: {
          ...state.edges,
          isEdgesResponseError: true,
          isUpdateEdgeSuccess: false,
          error: action.payload,
        },
      };
    case "get_kubectl_config_success":
      return {
        ...state,
        edges: {
          ...state.edges,
          getKubectlConfigSuccess: true,
          downloadKubectlConfigReady: true,
          kubectlConfig: action.payload.data,
        },
      };
    case "get_kubectl_config_error":
      return {
        ...state,
        edges: {
          ...state.edges,
          getKubectlConfigSuccess: false,
          downloadKubectlConfigReady: false,
          error: action.payload,
        },
      };
    case "get_download_yaml_success":
      return {
        ...state,
        downloadYAML: action.payload.data,
      };
    case "cluster_status_success":
      return {
        ...state,
        clusterStatusData: action.payload.data,
      };
    case "get_metro_list_success":
      return {
        ...state,
        metroList: action.payload.data.items,
        isLocationError: false,
      };
    case "add_location_success":
      return {
        ...state,
        isLocationCreateSuccess: true,
        isLocationError: false,
      };
    case "add_location_error":
      return {
        ...state,
        isLocationCreateSuccess: false,
        isLocationError: true,
        locationError: action.payload,
      };
    case "edit_location_success":
      return {
        ...state,
        isLocationEditSuccess: true,
        isLocationError: false,
      };
    case "edit_location_error":
      return {
        ...state,
        isLocationEditSuccess: false,
        isLocationError: true,
        locationError: action.payload,
      };
    case "reset_location_error":
      return {
        ...state,
        isLocationError: false,
        locationError: null,
      };
    case "get_metro_list_error":
      return {
        ...state,
        isLocationError: true,
        locationError: action.payload,
      };
    case "delete_location_error":
      return {
        ...state,
        isLocationError: true,
        locationError: action.payload,
      };
    case "reset_redux_state":
      state.edges.list = [];
      return {
        ...state,
      };
    case "get_user_success":
      return {
        ...state,
        account: action.payload,
        isGetUserDataSuccess: true,
      };
    case "get_user_failed":
      return {
        ...state,
        isGetUserDataFailed: true,
      };
    case "user_session_expired":
      return {
        ...state,
        isSessionExpired: true,
        isLoginSuccess: false,
      };
    case "get_users_success":
      return {
        ...state,
        users: {
          list: action.payload.data.items,
          listCount: action.payload.data.metadata.count,
        },
        isAddUserSuccess: false,
      };
    case "get_users_loading_state":
      return {
        ...state,
        getUsersIsLoading: action.payload,
      };
    case "get_roles_success":
      return {
        ...state,
        roles: {
          list: changeValuePosition(action.payload.data.items),
        },
      };
    case "reset_roles_list":
      return {
        ...state,
        roles: {},
      };
    case "reset_role":
      return {
        ...state,
        roles: {
          isDeleteSuccess: false,
          isDeleteFailed: false,
          isUpdateRoleError: false,
          isCreateSuccess: false,
          isAddRolePermissionError: false,
          error: null,
          permissions: {},
          roleDetail: null,
          loading: false,
        },
      };
    case "get_roledetail_success":
      state.roles.roleDetail = action.payload.data;
      return {
        ...state,
        isSessionExpired: false,
      };
    case "get_rolepermission_success":
      return {
        ...state,
        permissions: {
          list: action.payload.data.items,
        },
      };
    case "create_role_success":
      return {
        ...state,
        roles: {
          ...state.roles,
          isCreateSuccess: true,
          newRole: action.payload.data,
        },
      };
    case "create_role_error":
      return {
        ...state,
        roles: {
          ...state.roles,
          isCreateSuccess: false,
          error: action.payload,
        },
      };
    case "delete_role_success":
      return {
        ...state,
        roles: {
          ...state.roles,
          isDeleteSuccess: true,
        },
      };
    case "delete_role_error":
      return {
        ...state,
        roles: {
          ...state.roles,
          isDeleteFailed: true,
          error: action.payload,
        },
      };
    case "update_role_error":
      return {
        ...state,
        roles: {
          ...state.roles,
          isUpdateGroupError: true,
          error: action.payload,
        },
      };
    case "add_user_success":
      return {
        ...state,
        isAddUserSuccess: true,
        newUser: action.payload.data.spec,
      };
    case "edit_user_success":
      return {
        ...state,
        isEditUserSuccess: true,
      };
    case "user_response_error":
      state.users.error = action.payload;
      state.users.isUserResponseError = true;
      state.isUserResponseError = true;
      return { ...state };
    case "user_response_error_reset":
      state.users.error = null;
      state.users.isUserResponseError = false;
      state.isUserResponseError = false;
      return { ...state };
    case "get_organizations_success":
      state.organization.detail = action.payload;
      return {
        ...state,
        isSessionExpired: false,
      };
      return { ...state };
    case "get_language":
      state.lang = action.payload;
      return { ...state };
    case "get_Wid":
      state.Wid = action.payload;
      return { ...state };
    case "get_timestamp":
      return {
        ...state,
        time_stamp: action.payload,
      };
    case "get_partner_detail_success":
      Cookies.set("support_email", action.payload.partner_helpdesk_email);
      Cookies.set("logo_link", action.payload.logo_link);
      return {
        ...state,
        partnerDetail: action.payload,
        isSessionExpired: false,
      };
    case "user_forgotpassword_success":
      return {
        ...state,
        isForgotPasswordSuccess: true,
      };
    case "user_forgotpassword_error":
      state.auth.error = action.payload;
      state.isForgotPasswordFailed = true;
      return { ...state };
    case "user_forgotpassword_error_reset":
      state.auth.error = null;
      state.isForgotPasswordFailed = false;
      return { ...state };
    case "user_setpassword_success":
      return {
        ...state,
        isSetPasswordSuccess: true,
        isLoginSuccess: false,
      };
    case "user_setpassword_error":
      state.auth.error = action.payload;
      state.isSetPasswordFailed = true;
      return { ...state };
    case "user_setpassword_error_reset":
      state.auth.error = null;
      state.isSetPasswordFailed = false;
      state.isSetPasswordSuccess = false;
      return { ...state };
    case "get_namespace":
      state.namespace = action.payload;
      return { ...state };

    case "create_namespace":
      state.namespace = action.payload;
      return { ...state };

    case "send_email_verification_success":
      state.auth.email_verification_attempts_pending =
        action.payload.data.attempts_pending;
      return {
        ...state,
        isSendVerificationEmailSuccess: true,
      };

    case "send_email_verification_error":
      state.auth.error = action.payload;
      state.isSendVerificationEmailFailed = true;
      return { ...state };

    case "deactivate_user_success":
      state.users.list = state.users.list.map((user) => {
        if (user.id === action.payload.data.id) return action.payload.data;
        return user;
      });
      return { ...state, isActivateSuccess: true };
    case "activate_user_success":
      state.users.list = state.users.list.map((user) => {
        if (user.id === action.payload.data.id) return action.payload.data;
        return user;
      });
      return { ...state, isActivateSuccess: true };
    case "user_response_reset":
      return {
        ...state,
        isActivateSuccess: false,
        isAddUserSuccess: false,
        isEditUserSuccess: false,
      };
    case "user_changepassword_success":
      return {
        ...state,
        isChangePasswordSuccess: true,
        isChangePasswordError: false,
      };
    case "user_changepassword_error":
      state.auth.error = action.payload;
      return { ...state, isChangePasswordError: true };
    case "captcha_refresh_success":
      return {
        ...state,
        isCaptchaRefreshSuccess: true,
        captchaImageSource: action.payload.data.new_cptch_image,
        captchaKey: action.payload.data.new_cptch_key,
      };
    case "signup_verify_error":
      if (
        action.payload.details &&
        action.payload.details[0].error_code === "AUTH043"
      ) {
        return {
          ...state,
          isSignUpEmailAlreadyVerified: true,
        };
      }
      return {
        ...state,
        isSignUpVerifyFailed: true,
        isSignUpVerifySuccess: false,
      };

    case "signup_verify_success":
      return {
        ...state,
        isSignUpVerifyFailed: false,
        isSignUpVerifySuccess: true,
      };
    case "user_signup_resend_reset":
      return {
        ...state,
        isSendVerificationEmailSuccess: false,
        isSendVerificationEmailFailed: false,
      };
    case "user_org_change_reset":
      return {
        ...state,
        isChangeOrgSuccess: false,
      };
    case "get_apikeys_success":
      return {
        ...state,
        apikeys: action.payload.data,
        isAPIKeysSuccess: true,
        isAPIKeysError: false,
      };
    case "create_apikey_success":
      return {
        ...state,
        apikey: action.payload.data,
        isAPIKeyCreateSuccess: true,
        isAPIKeyCreateFailure: false,
      };
    case "create_apikey_response_error":
      return {
        ...state,
        apiKeyErrorMsg: action.payload.details[0].detail,
        isAPIKeyCreateSuccess: false,
        isAPIKeyCreateFailure: true,
      };
    case "get_regauthkeys_success":
      return {
        ...state,
        regAuthKeys: action.payload.data,
        isRegistryAuthKeysSuccess: true,
        isRegistryAuthKeysFailure: false,
      };
    case "create_regauthkeys_success":
      return {
        ...state,
        regAuthKey: action.payload.data,
        isRegistryAuthKeyCreateSuccess: true,
        isRegistryAuthKeyCreateFailure: false,
      };
    case "create_regauthkey_response_error":
      return {
        ...state,
        registryAuthKeyErrorMsg: action.payload.details[0].detail,
        isRegistryAuthKeyCreateSuccess: false,
        isRegistryAuthKeyCreateFailure: true,
      };
    case "cli_download_options_success":
      return {
        ...state,
        rafayClidownloadOptions: action.payload.data,
        isDownloadOptionsSucess: true,
        isDownloadOptionsFailure: false,
      };

    case "cli_download_reset":
      return {
        ...state,
        isDownloadOptionsSucess: false,
        isDownloadOptionsFailure: false,
      };

    case "delete_apikey_success":
      return {
        ...state,
        isAPIKeyDeleteSuccess: true,
        isAPIKeyDeleteFailure: false,
      };

    case "delete_regauthkey_success":
      return {
        ...state,
        isRegKeyDeleteSuccess: true,
        isRegKeyDeleteFailure: false,
      };

    case "user_apikey_response_reset":
      return {
        ...state,
        isAPIKeyDeleteSuccess: false,
        isAPIKeyDeleteFailure: false,
        isAPIKeyCreateSuccess: false,
        isAPIKeyCreateFailure: false,
      };
    case "user_registryauth_response_reset":
      return {
        ...state,
        isRegistryAuthKeyCreateSuccess: false,
        isRegistryAuthKeyCreateFailure: false,
        isRegistryAuthKeysSuccess: false,
        isRegistryAuthKeysFailure: false,
        isRegKeyDeleteFailure: false,
        isRegKeyDeleteSuccess: false,
      };
    case "user_changepassword_error_reset":
      return { ...state, isChangePasswordError: false };

    case "update_pagination":
      this.state.pagination[action.payload.type] = action.payload;
      return {
        ...state,
        [action.payload.type]: {
          ...this.state[action.payload.type],
          ...action.payload.data,
        },
      };

    case "delete_user_success":
      return {
        ...state,
        isDeleteUserSucess: true,
      };

    case "delete_user_response_error":
      state.users.error = action.payload;
      return {
        ...state,
        isDeleteUserFailed: true,
        isDeleteUserSucess: false,
      };

    case "user_delete_response_reset":
      return {
        ...state,
        isDeleteUserFailed: false,
        isDeleteUserSucess: false,
      };
    case "get_totp_url_success":
      return {
        ...state,
        totpUrl: action.payload.data ? action.payload.data.totp_url : "",
      };
    case "user_verify_totp_success":
      return {
        ...state,
        totpVerifySuccess: true,
      };
    case "mfa_reset":
      return {
        ...state,
        totpUrl: "",
        totpVerifySuccess: false,
        isTotpRequired: false,
      };
    case "reload_app":
      return {
        ...state,
        reloadApp: true,
      };
    case "download_v2_response":
      state.download_index += 1;
      return {
        ...state,
        downloadYAML: action.payload.data,
      };
    case "download_values_response":
      return {
        ...state,
        downloadYAML: action.payload.data,
      };
    default:
      return state;
  }
};

export default settings;
