import { TOP_ALERT } from "../actions/types";

const initialState = {
  showAlert: false,
  message: null,
  type: null,
};

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    case TOP_ALERT:
      return {
        showAlert: action.payload.showAlert,
        message: action.payload.message,
        type: action.payload.type,
      };
    default:
      return state;
  }
}
