import { LOGGED_IN_USER } from "./types";

export const updateLoggedInUser = (firstName, lastName, userType) => (dispatch) => {
  return dispatch({
    type: LOGGED_IN_USER,
    payload: { firstName, lastName, userType },
  });
};
