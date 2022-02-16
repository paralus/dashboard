const initialData = {
  isProjectSet: false,
  projectsList: null,
  currentProject: null,
  reloadOnChangeProject: false,
  projectRoles: null,
  projectUsers: null,
  projectGroups: null,
  projectDetail: null,
  isAddUserError: false,
  isAddGroupError: false,
  error: null
};

const Projects = (state = initialData, action) => {
  let { currentProject, projectRoles } = state;
  const { projectsList } = state;
  switch (action.type) {
    case "get_init_projects_success":
      if (!projectsList) {
        return {
          ...state,
          isProjectSet: action.payload.data.count > 0,
          projectsList: action.payload.data,
          currentProject: action.currentProject
        };
      }
      return {
        ...state
      };

    case "get_projects_success":
      return {
        ...state,
        isProjectSet: action.payload.data.count > 0,
        projectsList: action.payload.data,
        currentProject
      };
    case "get_project_success":
      return {
        ...state,
        projectDetail: action.payload.data
      };
    case "create_project_success":
      return {
        ...state,
        isProjectSet: true
      };
    case "set_current_project":
      if (state.projectsList) {
        currentProject = state.projectsList.results.find(p => {
          return p.id === action.payload.id;
        });
      }
      return {
        ...state,
        currentProject,
        reloadOnChangeProject: !action.payload.noReload
      };
    case "reset_change_project":
      return {
        ...state,
        reloadOnChangeProject: false
      };
    case "reset_project":
      return {
        ...state,
        isProjectSet: false,
        projectsList: null,
        currentProject: null,
        reloadOnChangeProject: false
      };
    case "get_projectaccountroles_success":
      if (action.payload.data && action.payload.data.results) {
        projectRoles = action.payload.data.results;
      }
      return {
        ...state,
        projectRoles
      };
    case "get_project_users_success":
      return {
        ...state,
        projectUsers: action.payload.data.results
      };
    case "get_project_groups_success":
      return {
        ...state,
        projectGroups: action.payload.data.results
      };
    case "add_projectusers_error":
      return {
        ...state,
        isAddUserError: true,
        error: action.payload
      };
    case "add_projectgroups_error":
      return {
        ...state,
        isAddGroupError: true,
        error: action.payload
      };
    case "reset_project_error":
      return {
        ...state,
        isAddUserError: false,
        isAddGroupError: false,
        error: null
      };
    default:
      return state;
  }
};

export default Projects;
