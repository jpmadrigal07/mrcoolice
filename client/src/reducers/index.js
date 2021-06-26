import { combineReducers } from "redux";
import topAlertReducers from "./topAlertReducers";
import loggedInUserReducers from "./loggedInUserReducers";

export default combineReducers({
  topAlert: topAlertReducers,
  loggedInUser: loggedInUserReducers
});
