import { combineReducers } from "redux";
import topAlertReducers from "./topAlertReducers";

export default combineReducers({
  topAlert: topAlertReducers,
});
