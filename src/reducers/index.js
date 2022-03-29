import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Projects from "./Projects";
import Groups from "./Groups";
import UserSession from "./UserSession";
import Users from "./Users";
import settings from "./Settings";
import Kubectl from "./Kubectl";
import EdgesData from "./edges";
import AuditLogs from "./AuditLogs";
import Tools from "./Tools";

const reducers = (history) =>
  combineReducers({
    // routing: routerReducer,
    router: connectRouter(history),
    Projects,
    Groups,
    UserSession,
    Users,
    settings,
    Kubectl,
    EdgesData,
    AuditLogs,
    Tools,
  });

export default reducers;
