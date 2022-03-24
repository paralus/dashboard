const initialData = {
  roles: [],
  projectRoles: {},
  projectId: null,
  noRolesUser: false,
  visibleInfra: true,
  visibleApps: true,
  visibleAdmin: true,
  visibleSystem: true,
  userRoles: {},
};

const parseProjectRoles = (roles) => {
  return (
    roles?.reduce((ret, item) => {
      if (!item.project) {
        return ret;
      }
      let data = {
        visibleInfra: false,
        visibleApps: false,
        visibleSystem: false,
      };
      if (ret[item.project.id]) {
        data = ret[item.project.id];
      }
      switch (item.role.name) {
        case "PROJECT_READ_ONLY":
        case "PROJECT_ADMIN":
          data.visibleApps = true;
          data.visibleSystem = true;
          break;
        case "NAMESPACE_READ_ONLY":
        case "NAMESPACE_ADMIN":
          data.visibleApps = true;
          break;
        case "INFRA_READ_ONLY":
        case "INFRA_ADMIN":
          data.visibleInfra = true;
          data.visibleSystem = true;
          break;
        case "CLUSTER_ADMIN":
          data.visibleInfra = true;
          break;
        default:
          break;
      }
      ret[item.project.id] = data;
      return ret;
    }, {}) || {}
  );
};

const parseUserRoles = (roles) => {
  const userRoles = {};
  roles.forEach((r) => {
    switch (r.role.name) {
      case "PROJECT_READ_ONLY":
        userRoles.projectReadOnly = true;
        break;
      case "PROJECT_ADMIN":
        userRoles.projectAdmin = true;
        break;
      case "NAMESPACE_READ_ONLY":
        userRoles.namespaceReadOnly = true;
        break;
      case "NAMESPACE_ADMIN":
        userRoles.namespaceAdmin = true;
        break;
      case "INFRA_READ_ONLY":
        userRoles.infaReadOnly = true;
        break;
      case "INFRA_ADMIN":
        userRoles.infaAdmin = true;
        break;
      case "ADMIN":
        userRoles.admin = true;
        break;
    }
  });

  return userRoles;
};

const createSession = (user) => {
  const data = {
    noRolesUser: false,
    visibleInfra: false,
    visibleApps: false,
    visibleAdmin: false,
    visibleSystem: false,
  };
  const { roles } = user;
  if (roles && roles.length === 0) {
    data.noRolesUser = true;
  } else if (
    roles?.find((r) =>
      ["ADMIN", "ADMINISTRATOR_READ_ONLY"].includes(r.role.name)
    )
  ) {
    data.visibleAdmin = true;
    data.visibleApps = true;
    data.visibleInfra = true;
    data.visibleSystem = true;
  }
  data.roles = roles;
  data.projectRoles = parseProjectRoles(roles);
  return data;
};

const createProjectSession = (roles, projectId) => {
  const data = {
    visibleInfra: false,
    visibleApps: false,
    visibleSystem: false,
    projectId,
  };
  const projectRoles = roles.filter(
    (r) => r.project && r.project.id === projectId
  );
  projectRoles.forEach((ac) => {
    switch (ac.role.name) {
      case "PROJECT_READ_ONLY":
      case "PROJECT_ADMIN":
        data.visibleApps = true;
        data.visibleSystem = true;
        break;
      case "NAMESPACE_READ_ONLY":
      case "NAMESPACE_ADMIN":
        data.visibleApps = true;
        break;
      case "INFRA_READ_ONLY":
      case "INFRA_ADMIN":
        data.visibleInfra = true;
        data.visibleSystem = true;
        break;
      case "CLUSTER_ADMIN":
        data.visibleInfra = true;
        break;
      default:
        break;
    }
  });

  data.userRoles = parseUserRoles(projectRoles);

  return data;
};

const UserSession = (state = initialData, action) => {
  let adminSession = {};
  let projectSession = {};
  switch (action.type) {
    case "set_user_session":
      adminSession = createSession(action.user);
      return {
        ...state,
        ...adminSession,
      };
    case "update_user_session":
      adminSession = createSession(action.user);
      if (!adminSession.visibleAdmin && state.projectId) {
        projectSession = createProjectSession(
          action.user.roles,
          state.projectId
        );
        return {
          ...state,
          ...adminSession,
          ...projectSession,
        };
      }
      return {
        ...state,
        ...adminSession,
      };
    case "set_session_current_project":
      if (state.visibleAdmin) return state;
      projectSession = createProjectSession(state.roles, action.payload);
      return {
        ...state,
        ...projectSession,
      };
    case "reset_usersession":
      return {
        ...initialData,
      };
    default:
      return state;
  }
};

export default UserSession;
