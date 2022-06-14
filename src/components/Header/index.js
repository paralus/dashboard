import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Paralus from "assets/images/paralus.png";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import {
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  MINI_DRAWER,
} from "constants/ActionTypes";
import UserInfo from "components/UserInfo";
import {
  setDrawerType,
  changeProject,
  resetChangeProject,
} from "actions/index";
import ProjectSelector from "./ProjectSelector";
import HomeNav from "./HomeNav";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  callsetDrawer = () => {
    const { drawerType, setDrawerType } = this.props;
    if (drawerType === FIXED_DRAWER) {
      setDrawerType(MINI_DRAWER);
    } else {
      setDrawerType(FIXED_DRAWER);
    }
  };

  handleProjectChange = (event) => {
    const { changeProject } = this.props;
    changeProject(event.target.value);
  };

  // org-Dashboard changes
  handleChangeProject = (param) => {
    const { changeProject } = this.props;
    changeProject(param);
  };

  render() {
    const {
      onToggleCollapsedNav,
      drawerType,
      partnerDetail,
      reloadOnChangeProject,
      projectsList,
      currentProject,
      resetChangeProject,
      isProjectRole,
      changeProject,
      history,
      match,
    } = this.props;

    let drawerStyle = "d-block d-xl-none";
    if (!drawerType.includes(FIXED_DRAWER)) {
      drawerStyle = "d-none";
      if (drawerType.includes(COLLAPSED_DRAWER)) {
        drawerStyle = "d-block";
      }
    }
    let image_src = "";
    if (partnerDetail) {
      image_src = Paralus;
    }
    if (partnerDetail && partnerDetail.logo_link) {
      image_src = partnerDetail.logo_link;
    }

    if (reloadOnChangeProject) {
      resetChangeProject();
      // Do not Redirect to login for reload if the path is Kubectl console
      if (
        match.path === "/console/:projectId/:clusterName" ||
        history.location.pathname === "/app/projectdashboard"
      )
        return "";

      window.location.reload();
    }

    const systemPaths = [
      "/app/projects",
      "/app/users",
      "/app/groups",
      "/app/settings",
      "/app/sso",
      "/app/audit",
      "/app/alerts",
      "/app/tools",
    ];
    const isSystemContext = systemPaths.some(
      (path) => history.location.pathname.indexOf(path) === 0
    );

    const isDashboard = match.path === "/app" && match.isExact;

    const hasUserConsoleAccess = !!currentProject; // HACK: currentProject is null for use with no roles

    return (
      <AppBar className="app-main-header">
        <Toolbar className="app-toolbar" disableGutters={false}>
          {/*
          {!this.props.hideMenuIcon && (
            <IconButton
              aria-label="Delete"
              style={{ marginLeft: "-17px" }}
              onClick={this.callsetDrawer}
            >
              <i
                className="zmdi zmdi-menu "
                style={{ color: "gray", cursor: "pointer" }}
              />
            </IconButton>
          )}
             */}
          <div className="text-center" style={{ minWidth: "143px" }}>
            <a
              className="app-logo"
              href="#/"
              onClick={(e) => {
                if (!hasUserConsoleAccess) e.preventDefault();
              }}
            >
              <img src={image_src} alt="" title="" />
            </a>
          </div>
          <IconButton
            className={`jr-menu-icon ${drawerStyle}`}
            aria-label="Menu"
            onClick={onToggleCollapsedNav}
          >
            <span className="menu-icon" />
          </IconButton>
          {hasUserConsoleAccess && <HomeNav />}
          {projectsList && currentProject && (
            <ProjectSelector
              options={projectsList.items}
              currentProject={currentProject}
              changeProject={changeProject}
              isSystemContext={isSystemContext || isDashboard}
              isProjectRole={isProjectRole}
            />
          )}

          <div className="ml-auto">
            <UserInfo />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = ({ settings, Projects, UserSession }) => {
  const { navCollapsed, drawerType } = settings;
  const { projectsList, currentProject, reloadOnChangeProject } = Projects;
  const { visibleApps, visibleSystem, visibleAdmin } = UserSession;
  const isProjectRole = !visibleAdmin && visibleApps && visibleSystem;
  return {
    navCollapsed,
    drawerType,
    projectsList,
    currentProject,
    reloadOnChangeProject,
    isProjectRole,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    setDrawerType,
    changeProject,
    resetChangeProject,
  })(Header)
);
