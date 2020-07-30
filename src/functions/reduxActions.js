export const UPDATE_CHAT = 'UPDATE_CHAT';

export function updateChat(data) {
  return function x(dispatch) {
    dispatch({
      type: UPDATE_CHAT,
      data,
    });
  };
}

export const UPDATE_NEW_CHAT = 'UPDATE_NEW_CHAT';

export function updateNewChat(data) {
  return function x(dispatch) {
    dispatch({
      type: UPDATE_NEW_CHAT,
      data,
    });
  };
}

export const SELECT_ITEM = 'SELECT_ITEM';

export function selectItem(data) {
  return function x(dispatch) {
    dispatch({
      type: SELECT_ITEM,
      data,
    });
  };
}

export const SELECT_TEAM = 'SELECT_TEAM';

export function selectTeam(data) {
  return function x(dispatch) {
    dispatch({
      type: SELECT_TEAM,
      data,
    });
  };
}
