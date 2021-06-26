import { LOGGED_IN_USER } from "../actions/types";

const initialState = {
  firstName: "",
  lastName: "",
  userType: "",
};

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    case LOGGED_IN_USER:
      return {
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        userType: action.payload.userType,
      };
    default:
      return state;
  }
}
