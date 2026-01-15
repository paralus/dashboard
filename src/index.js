import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import { Route, HashRouter, BrowserRouter, Switch } from "react-router-dom";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./reducers";
import App from "./containers/App";
import KratosSettings from "./containers/Auth/KratosSettings";
import ErrorPage from "./containers/Auth/ErrorPage";
import AutoRegister from "./containers/Auth/AutoRegister";

const logger = createLogger({ collapsed: true });

const history = createBrowserHistory();
const router = routerMiddleware(history);
let middleware = [router, thunk];
if (process.env.NODE_ENV !== "production") {
  middleware = [...middleware, logger];
}

const store = createStore(
  reducers(history),
  {},
  compose(applyMiddleware(...middleware)),
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/error-page" component={ErrorPage} />
          <Route exact path="/ksettings" component={KratosSettings} />
          <Route exact path="/registeroidc" component={AutoRegister} />
          <Route path="/">
            <HashRouter>
              <Route path="/" component={App} />
            </HashRouter>
          </Route>
        </Switch>
      </BrowserRouter>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("app-site"),
);
