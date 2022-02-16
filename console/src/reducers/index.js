import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Projects from "./Projects";
import Groups from "./Groups";
import UserSession from "./UserSession";
import Users from "./Users";

const reducers = history =>
  combineReducers({
    // routing: routerReducer,
    router: connectRouter(history),
    Projects,
    Groups,
    UserSession,
    Users,
  });

export default reducers;
