import React, { Component } from "react";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Redirect, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { connect } from "react-redux";
import T from "i18n-react";

import {
  initializeApp,
  getUserSessionInfo,
  getInitProjects,
  getUserDetail,
} from "actions/index";
import { SnackbarProvider } from "utils/useSnack";
import SuspenseComponent from "components/SuspenseComponent";
import ErrorFallback from "utils/ErrorFallback";
import tealTheme from "./themes/tealTheme";
import "styles/bootstrap.scss";
import "styles/app.scss";

import AutoLogout from "./Auth/AutoLogout";

const MainApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ "app/index")
);
const AppMain = React.lazy(() =>
  import(/* webpackPrefetch: true */ "appMain/index")
);
const FullScreenKubectl = React.lazy(() =>
  import("containers/K8sConsole/FullScreenKubectl")
);
const Login = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./Auth/Login")
);

class App extends Component {
  constructor() {
    super();
    this.applyTheme = createTheme(tealTheme);
    this.state = {
      userDetailFetched: false,
      moveToReset: true,
    };
  }

  componentDidMount() {
    const { initializeApp, getUserSessionInfo, getInitProjects, lang } =
      this.props;
    initializeApp();
    getUserSessionInfo();
    this.timeout = setInterval(() => getUserSessionInfo(), 60000 * 5);
    T.setTexts(require(`./locale/${lang}.json`));
  }

  async componentDidUpdate(prevProps) {
    const { userAndRoleDetail, user } = prevProps;
    if (!!userAndRoleDetail && !this.state.userDetailFetched) {
      await this.props.getUserDetail(userAndRoleDetail.metadata.name);
      this.setState({ userDetailFetched: true });
    }
    const isSameUser =
      user?.metadata?.name === userAndRoleDetail?.metadata?.name;
    if (
      this.state.moveToReset &&
      !!user &&
      isSameUser &&
      user.spec.forceReset
    ) {
      this.setState({ moveToReset: false });
      window.location = `/ksettings?userid=${user.metadata.name}`;
    }
  }

  render() {
    //This is the starting point for console app, continue to post code from console ..
    const { match, location, isSessionExpired, UserSession } = this.props;

    // When the user first lands on the page, isSessionExpired will be
    // set to "UNKNOWN" from the initial state in the reducer.
    // If the user is already logged in (which is detected by doing a
    // userinfo), we then set the isSessionExpired to `false` and then
    // continue with business as usual but in the case that the user is
    // not logged in, we have to redirect them to the login page.

    if (isSessionExpired === "UNKNOWN") return null;

    if (isSessionExpired) {
      if (
        location.pathname !== "/login" &&
        !location.pathname.startsWith("/signup") &&
        !location.pathname.startsWith("/forgotpassword") &&
        !location.pathname.startsWith("/resetpassword") &&
        !location.pathname.startsWith("/loginerror") &&
        !location.pathname.startsWith("/verify")
      )
        window.location = "/#/login";
    } else if (location.pathname === "/ksettings") {
      return <Redirect to="/ksettings" />;
    } else if (location.pathname === "/") {
      if (UserSession.noRolesUser) {
        return <Redirect to="/app/noaccess" />;
      }
      return <Redirect to="/main" />;
    }

    return (
      <SnackbarProvider>
        <MuiThemeProvider theme={this.applyTheme}>
          <div className="app-main">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <SuspenseComponent>
                <Route path={`${match.url}main`} component={AppMain} />
                <Route path={`${match.url}app`} component={MainApp} />
                <Route path={`${match.url}login`} component={Login} />
                <Route
                  path={`${match.url}console/:projectId/:clusterName`}
                  component={FullScreenKubectl}
                />
              </SuspenseComponent>
            </ErrorBoundary>
          </div>
        </MuiThemeProvider>
        {!isSessionExpired && <AutoLogout />}
      </SnackbarProvider>
    );
  }
}

const mapStateToProps = ({ settings, UserSession, Users }) => {
  const {
    themeColor,
    sideNavColor,
    isSessionExpired,
    partnerDetail,
    organization,
    lang,
    userAndRoleDetail,
  } = settings;
  const { user } = Users;
  return {
    themeColor,
    sideNavColor,
    isSessionExpired,
    lang,
    UserSession,
    partnerDetail,
    organization,
    userAndRoleDetail,
    user,
  };
};

export default connect(mapStateToProps, {
  initializeApp,
  getUserSessionInfo,
  getInitProjects,
  getUserDetail,
})(App);
