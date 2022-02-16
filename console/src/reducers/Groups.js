const initialData = {
  groupsList: null,
  newGroup: null,
  isDeleteSuccess: false,
  isDeleteFailed: false,
  isUpdateGroupError: false,
  isCreateSuccess: false,
  isAddRoleError: false,
  error: null,
  roles: {},
  usersList: {},
  projects: [],
  groupDetail: null,
  loading: false
};

const Groups = (state = initialData, action) => {
  switch (action.type) {
    case "get_groups_load":
      return {
        ...state,
        loading: true
      };
    case "get_groups_success":
      return {
        ...state,
        loading: false,
        groupsList: action.payload.data
      };
    case "get_groups_error":
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case "create_group_success":
      return {
        ...state,
        isCreateSuccess: true,
        newGroup: action.payload.data
      };
    case "delete_group_success":
      return {
        ...state,
        isDeleteSuccess: true
      };
    case "delete_group_error":
      return {
        ...state,
        isDeleteFailed: true,
        error: action.payload
      };
    case "update_group_error":
      return {
        ...state,
        isUpdateGroupError: true,
        error: action.payload
      };
    case "create_group_error":
      return {
        ...state,
        createGroupError: true,
        error: action.payload
      };
    case "reset_group":
      return {
        ...state,
        isDeleteSuccess: false,
        isDeleteFailed: false,
        isUpdateGroupError: false,
        createGroupError: false,
        isCreateSuccess: false,
        isAddRoleError: false,
        error: null,
        groupDetail: null,
        loading: false
      };
    case "reset_group_list":
      return {
        ...state,
        groupsList: null,
        roles: {}
      };
    case "get_grouproles_success":
      return {
        ...state,
        roles: {
          ...state.roles,
          ...action.payload
        }
      };
    case "assign_grouprole_error":
      return {
        ...state,
        isAddRoleError: true,
        error: action.payload
      };
    case "get_group_detail_success":
      return {
        ...state,
        groupDetail: action.payload.data
      };
    case "get_group_projects_success":
      return {
        ...state,
        projects: action.payload.data
      };
    default:
      return state;
  }
};

export default Groups;
