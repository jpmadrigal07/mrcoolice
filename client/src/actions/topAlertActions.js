import { TOP_ALERT } from "./types";

export const triggerTopAlert = (showAlert, message, type) => (dispatch) => {
  return dispatch({
    type: TOP_ALERT,
    payload: { showAlert, message, type },
  });
};
