import React from "react";
import { Route, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { toggleCollapsedNav, userLogout } from "actions/index";
import ParalusMark from "assets/images/paralus-mark.png";
import Footer from "components/Footer";
import MiniKubectl from "containers/K8sConsole/MiniKubectl";
import { Helmet } from "react-helmet";
import { Container, Button } from "@material-ui/core";
import InfoCardComponent from "components/InfoCardComponent";
import { ConsolePaths } from "constants/ConsolePaths";

import Header from "./components/Header";

import Users from "./routes/users";
import Settings from "./routes/settings";
import Tools from "./routes/tools";
import AuditLogs from "./routes/auditLogs";
import Project from "./routes/project";
import Group from "./routes/group";
import Roles from "./routes/roles";
import Home from "./routes/home";
import IdpList from "./routes/sso/IdpList";
import RegistrationWizard from "./routes/sso/RegistrationWizard";

class AppMain extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => window?.localStorage.removeItem("org_changed"), 5000);
  }

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
      currentPath === "/app/namespaces"
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
      partnerDetail,
      UserSession,
      userLogout,
      organization,
      userAndRoleDetail,
      user,
    } = this.props;
    let favicon_src = ParalusMark;
    if (partnerDetail && partnerDetail.fav_icon_link) {
      favicon_src = partnerDetail.fav_icon_link;
    }
    const hasAccess = this.userHasAccess();
    const forceResetEnabledForUser =
      user === null ||
      (!!user && !user.spec.forceReset) ||
      (user.spec.forceReset &&
        user.metadata.name !== userAndRoleDetail.metadata.name);
    if (
      !hasAccess &&
      !UserSession.noRolesUser &&
      window?.localStorage.getItem("org_changed") === "ORG_CHANGED"
    ) {
      window?.localStorage.removeItem("org_changed");
      return <Redirect to="/" />;
    }
    const title = this.capitalize(partnerDetail?.metadata.name);
    let mainContainer = "app-container";
    if (this.props.kubectlOpen) mainContainer += " kubectl-open";

    return (
      <div className={mainContainer}>
        <Helmet>
          <title>{title}</title>
          <link rel="icon" type="image/x-icon" href={favicon_src} />
        </Helmet>
        <div className="app-main-container">
          <Header partnerDetail={partnerDetail} />
          {UserSession.noRolesUser && (
            <div style={{ paddingTop: "75px" }}>
              <InfoCardComponent
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
              <InfoCardComponent
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
          {hasAccess &&
            currentProject &&
            currentProject.metadata.name &&
            forceResetEnabledForUser && (
              <main className="app-main-content-wrapper">
                <div className="app-main-content">
                  <Container maxWidth="lg">
                    <Route exact path={`${match.url}`} component={Home} />
                    <Route path={`${match.url}/users`} component={Users} />
                    <Route
                      path={`${match.url}/settings`}
                      component={Settings}
                    />
                    <Route path={`${match.url}/tools`} component={Tools} />
                    <Route path={`${match.url}/audit`} component={AuditLogs} />
                    <Route path={`${match.url}/projects`} component={Project} />
                    <Route path={`${match.url}/groups`} component={Group} />
                    <Route path={`${match.url}/roles`} component={Roles} />
                    <Route
                      exact
                      path={`${match.url}/sso/new`}
                      component={RegistrationWizard}
                    />
                    <Route
                      exact
                      path={`${match.url}/sso/update/:ssoId`}
                      component={RegistrationWizard}
                    />
                    <Route
                      exact
                      path={`${match.url}/sso`}
                      component={IdpList}
                    />
                  </Container>
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

const mapStateToProps = ({
  settings,
  Projects,
  UserSession,
  Kubectl,
  Users,
}) => {
  const { organization, partnerDetail, reloadApp, userAndRoleDetail } =
    settings;
  const { currentProject } = Projects;
  const kubectlOpen = Kubectl?.open;
  const { user } = Users;

  return {
    partnerDetail,
    currentProject,
    reloadApp,
    organization,
    UserSession,
    kubectlOpen,
    userAndRoleDetail,
    user,
  };
};

export default withRouter(
  connect(mapStateToProps, { toggleCollapsedNav, userLogout })(AppMain),
);
