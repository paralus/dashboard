// NOTE: how much this reducer works with the permissions
// top level control here? read permissions for meus/page access
// check granular permissionsin the respective components

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
      if (ret[item.project]) {
        data = ret[item.project];
      }
      item.permissions.forEach((perm) => {
        switch (perm) {
          case "project.read":
          case "project.write":
          case "project.admin.write":
            data.visibleApps = true;
            data.visibleSystem = true;
            break;

          case "cluster.read":
          case "cluster.write":
            data.visibleInfra = true;
            break;
        }
      });
      ret[item.project] = data;
      return ret;
    }, {}) || {}
  );
};

const parseUserRoles = (roles) => {
  const userRoles = {};
  roles.forEach((r) => {
    r.permissions.forEach((perm) => {
      switch (perm) {
        case "project.read":
          userRoles.projectReadOnly = true;
          break;
        case "project.write":
          userRoles.projectReadOnly = false;
          break;
        case "project.admin.write":
          userRoles.projectAdmin = true;
          break;
        case "project.relayAudit.read":
          userRoles.projectAuditRead = true;
          break;
      }
    });
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
  const roles = user.spec.permissions;
  // TODO: Check user.spec.permissions.[].permissions to determine if admin or not
  // Which permissions to check to determine admin-ness?
  if (roles == undefined || (roles && roles.length === 0)) {
    data.noRolesUser = true;
  } else if (
    roles?.find((r) => ["ADMIN", "ADMIN_READ_ONLY"].includes(r.role))
  ) {
    data.visibleAdmin = true;
    data.visibleApps = true;
    data.visibleInfra = true;
    data.visibleSystem = true;
  }
  data.roles = roles;
  data.projectRoles = parseProjectRoles(roles);
  data.userRoles = parseUserRoles(roles);
  return data;
};

const createProjectSession = (roles, projectId) => {
  const data = {
    visibleInfra: false,
    visibleApps: false,
    visibleSystem: false,
    projectId,
  };
  let targetProjectId =
    projectId.metadata === undefined ? projectId : projectId.metadata.name;
  const projectRoles = roles.filter(
    (r) => r.project && r.project === targetProjectId
  );
  projectRoles.forEach((ac) => {
    ac.permissions.forEach((perm) => {
      switch (perm) {
        case "project.read":
        case "project.write":
        case "project.admin.write":
          data.visibleApps = true;
          data.visibleSystem = true;
          break;

        case "cluster.read":
        case "cluster.write":
          data.visibleInfra = true;
          break;
      }
    });
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
          action.user.spec.permissions,
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
