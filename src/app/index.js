import React from "react";
import { Route, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import {
  toggleCollapsedNav,
  getOrgKubeconfigSettings,
  userLogout,
} from "actions/index";

import Header from "components/Header/index";
import Sidebar from "containers/SideNav/index";
import Footer from "components/Footer";
import MiniKubectl from "containers/K8sConsole/MiniKubectl";
import { COLLAPSED_DRAWER, FIXED_DRAWER } from "constants/ActionTypes";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import RafayInfoCard from "components/RafayInfoCard";
import RafaySuspense from "components/RafaySuspense";
import { ConsolePaths } from "constants/ConsolePaths";
import Cluster from "./routes/cluster";

const Edges = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./routes/edges")
);

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => window?.localStorage.removeItem("org_changed"), 5000);
    const orgId = this.props?.organization?.id;
    this.props.getOrgKubeconfigSettings(orgId); // Set KubeConfig redux state that is used for show/hide Kubectl web access
  }

  onToggleCollapsedNav = (_) => {
    const { navCollapsed, toggleCollapsedNav } = this.props;
    toggleCollapsedNav(!navCollapsed);
  };

  static getDerivedStateFromProps(props, state) {
    if (props.reloadApp) {
      window.location.reload();
    }
    return null;
  }

  userHasAccess = (_) => {
    const { location, UserSession } = this.props;
    const currentPath = location.pathname;
    let hasAccess = true;
    if (!UserSession.visibleApps) {
      hasAccess =
        hasAccess &&
        !ConsolePaths.system.some((path) => currentPath.indexOf(path) === 0);
    }
    if (!UserSession.visibleInfra) {
      hasAccess =
        hasAccess &&
        !ConsolePaths.infra.some((path) => currentPath.indexOf(path) === 0);
    }
    if (!UserSession.visibleAdmin) {
      hasAccess =
        hasAccess &&
        !ConsolePaths.system.some((path) => currentPath.indexOf(path) === 0);
    }

    // Namespaces is a special case. It is visible with both infra and project admin roles
    if (
      UserSession.visibleApps &&
      !UserSession.visibleAdmin &&
      currentPath.includes("/app/namespaces")
    ) {
      hasAccess = true;
    }
    return hasAccess;
  };

  backToHome = (_) => {
    const { history } = this.props;
    history.push("/");
  };

  capitalize = (string) => {
    if (!string) {
      return " ";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const {
      match,
      currentProject,
      drawerType,
      partnerDetail,
      UserSession,
      userLogout,
      organization,
    } = this.props;
    let drawerStyle = drawerType.includes(FIXED_DRAWER);
    if (drawerType.includes(FIXED_DRAWER)) {
      drawerStyle = "fixed-drawer";
    } else if (drawerType.includes(COLLAPSED_DRAWER)) {
      drawerStyle = "collapsible-drawer";
    } else {
      drawerStyle = "mini-drawer";
    }
    let favicon_src =
      "https://pbs.twimg.com/profile_images/934706849508573186/_l78sPtc_400x400.jpg";
    if (partnerDetail && partnerDetail.spec && partnerDetail.spec.favIconLink) {
      favicon_src = partnerDetail.spec.favIconLink;
    }
    const hasAccess = this.userHasAccess();

    if (
      !hasAccess &&
      !UserSession.noRolesUser &&
      window?.localStorage.getItem("org_changed") === "ORG_CHANGED"
    ) {
      window?.localStorage.removeItem("org_changed");
      return <Redirect to="/app/workloads" />;
    }

    const title = this.capitalize(partnerDetail?.metadata.name);
    let mainContainer = `app-container ${drawerStyle}`;
    if (this.props.kubectlOpen) mainContainer += " kubectl-open";

    return (
      <div className={mainContainer}>
        <Helmet>
          <title>{title}</title>
          <link rel="icon" type="image/x-icon" href={favicon_src} />
        </Helmet>
        {hasAccess && !UserSession.noRolesUser && (
          <Sidebar onToggleCollapsedNav={this.onToggleCollapsedNav} />
        )}
        <div className="app-main-container">
          <Header
            drawerType={drawerType}
            onToggleCollapsedNav={this.onToggleCollapsedNav}
            partnerDetail={partnerDetail}
          />
          {UserSession.noRolesUser && (
            <div style={{ paddingTop: "75px" }}>
              <RafayInfoCard
                title={<span>No Access</span>}
                linkHelper={
                  <span>
                    You do not have access to any projects. Please contact your
                    administrator.
                  </span>
                }
                link={
                  <Button className="text-teal" onClick={(_) => userLogout()}>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 500,
                        color: "teal",
                      }}
                    >
                      <span>Logout</span>
                    </span>
                  </Button>
                }
              />
            </div>
          )}
          {!hasAccess && !UserSession.noRolesUser && (
            <div style={{ paddingTop: "75px" }}>
              <RafayInfoCard
                title={<span>No Access</span>}
                linkHelper={
                  <span>
                    You do not have access to this path. Please contact your
                    administrator.
                  </span>
                }
                link={
                  <Button className="text-teal" onClick={this.backToHome}>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 500,
                        color: "teal",
                      }}
                    >
                      <i className="zmdi zmdi-long-arrow-left pr-3" />
                      <span>Back to Home</span>
                    </span>
                  </Button>
                }
              />
            </div>
          )}
          {hasAccess && currentProject && currentProject.metadata.name && (
            <main className="app-main-content-wrapper">
              <div className="app-main-content">
                <RafaySuspense>
                  {/* <Route exact path={`${match.url}`} component={Home} /> */}
                  <Route path={`${match.url}/clusters`} component={Cluster} />
                  <Route path={`${match.url}/edges`} component={Edges} />
                </RafaySuspense>
              </div>
            </main>
          )}
          {!this.props.kubectlOpen && <Footer />}
        </div>
        {hasAccess && currentProject?.metadata.name && <MiniKubectl />}
      </div>
    );
  }
}

const mapStateToProps = ({ settings, Projects, UserSession, Kubectl }) => {
  const {
    navCollapsed,
    drawerType,
    partnerDetail,
    reloadApp,
    userAndRoleDetail = {},
  } = settings;
  const { currentProject } = Projects;
  const { organization = {} } = userAndRoleDetail;
  const kubectlOpen = Kubectl?.open;
  return {
    navCollapsed,
    drawerType,
    partnerDetail,
    currentProject,
    reloadApp,
    UserSession,
    organization,
    kubectlOpen,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    toggleCollapsedNav,
    getOrgKubeconfigSettings,
    userLogout,
  })(App)
);
