const initialData = {
  user: null,
  userDetail: null,
  userGroups: [],
  userRoles: [],
  isGroupDeleteError: false,
};

const Users = (state = initialData, action) => {
  switch (action.type) {
    case "get_user_detail_success":
      return {
        ...state,
        user: action.payload.data,
        userDetail: action.payload.data,
      };
    case "get_user_groups_success":
      return {
        ...state,
        userGroups: action.payload.data,
      };
    case "remove_groups_from_user_error":
      if (
        action.payload &&
        action.payload.details &&
        action.payload.details.length > 0
      )
        return {
          ...state,
          isGroupDeleteError: true,
          error: action.payload.details[0].detail,
        };

      return {
        ...state,
        isGroupDeleteError: true,
        error: action.payload,
      };
    case "user_group_delete_reset":
      return {
        ...state,
        isGroupDeleteError: false,
      };
    case "reset_users_userdetail":
      return {
        ...state,
        userDetail: null,
      };
    case "reset_user":
      return {
        ...state,
        user: null,
        userDetail: null,
      };
    case "get_IDP_users_success":
      return {
        ...state,
        idpUsers: action.payload?.data?.users,
      };
    default:
      return state;
  }
};

export default Users;
