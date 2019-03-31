/**
 * Reducer which handles all events related to user authentication process
 */

const authReducer = (state = {}, action) => {
  switch (action.type) {
    // When login event is called, will update redux state with userId,
    // userType, and name so we know who is logged in
    case 'LOGIN': {
      const newState = Object.assign({}, state);
      newState.username = action.username;
      newState.password = action.password;
      newState.authenticated = action.authenticated;
      return newState;
    }

    // When logout event is called, will remove user from redux state
    case 'LOGOUT': {
      const newState = Object.assign({}, state);
      newState.username = null;
      newState.password = null;
      newState.authenticated = false;
      return newState;
    }

    default:
      return state;
  }
};

export default authReducer;
