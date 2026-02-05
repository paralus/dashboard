const initialData = {
  isProjectSet: false,
  projectsList: {
    items: [],
    metadata: { count: 0 },
  },
  currentProject: null,
  reloadOnChangeProject: false,
  projectRoles: {},
  projectUsers: [],
  projectGroups: [],
  projectDetail: null,
  isAddUserError: false,
  isAddGroupError: false,
  error: null,
};

const Projects = (state = initialData, action) => {
  let { projectRoles } = state;
  // const { projectsList } = state;
  switch (action.type) {
    case "get_init_projects_success": {
      const data = action.payload?.data || {};
      const items = Array.isArray(data.items) ? data.items : [];

      return {
        ...state,
        isProjectSet: items.length > 0,
        projectsList: {
          ...data,
          items,
        },
        currentProject: action.currentProject || null,
      };
    }
    case "get_projects_success": {
      const data = action.payload?.data || {};
      const items = Array.isArray(data.items) ? data.items : [];

      return {
        ...state,
        isProjectSet: items.length > 0,
        projectsList: {
          ...data,
          items,
        },
      };
    }
    case "get_project_success":
      return {
        ...state,
        projectDetail: action.payload?.data || null,
      };
    case "create_project_success":
      return {
        ...state,
        isProjectSet: true,
      };
    case "set_current_project": {
      const items = state.projectsList?.items || [];
      const currentProject =
        items.find((p) => p.metadata.name === action.payload.name) || null;

      return {
        ...state,
        currentProject,
        reloadOnChangeProject: !action.payload.noReload,
      };
    }
    case "reset_change_project":
      return {
        ...state,
        reloadOnChangeProject: false,
      };
    case "reset_project":
      return {
        ...state,
        isProjectSet: false,
        projectsList: {
          items: [],
          metadata: { count: 0 },
        },
        currentProject: null,
        reloadOnChangeProject: false,
      };
    case "get_projectaccountroles_success":
      if (action.payload.data && action.payload.data.results) {
        projectRoles = action.payload.data.results;
      }
      return {
        ...state,
        projectRoles,
      };
    case "get_project_users_success":
      return {
        ...state,
        projectUsers: action.payload?.data?.results || [],
      };
    case "get_project_groups_success":
      return {
        ...state,
        projectGroups: action.payload?.data?.results || [],
      };
    case "add_projectusers_error":
      return {
        ...state,
        isAddUserError: true,
        error: action.payload,
      };
    case "add_projectgroups_error":
      return {
        ...state,
        isAddGroupError: true,
        error: action.payload,
      };
    case "reset_project_error":
      return {
        ...state,
        isAddUserError: false,
        isAddGroupError: false,
        error: null,
      };
    default:
      return state;
  }
};

export default Projects;
