/**
 * Reducer which handles all events related to flashing error and notification messages
 */
const notificationReducer = (state = {}, action) => {
  switch (action.type) {
    // Flash an error
    case 'ERROR': {
      const newState = Object.assign({}, state);
      newState.error = action.error;
      newState.message = null;
      return newState;
    }

    // Flash a message
    case 'MESSAGE': {
      const newState = Object.assign({}, state);
      newState.error = null;
      newState.message = action.message;
      return newState;
    }

    // Wipe error and message
    case 'CLEAR': {
      const newState = Object.assign({}, state);
      newState.error = null;
      newState.message = null;
      return newState;
    }

    default:
      return state;
  }
};

export default notificationReducer;
