/* eslint-disable import/no-cycle */
import update from 'immutability-helper';
import {
  UPDATE_CHAT, UPDATE_NEW_CHAT, SELECT_ITEM, SELECT_TEAM,
} from '../functions/reduxActions';
import { TeamDocProps } from '../types/firestore';
import { ChatDBProps } from '../types/rtdb';

const initialState = {
  selected: null,
  team: <TeamDocProps>{
    name: '',
    logoUrl: '',
    primaryColor: '',
    secondaryColor: '',
    label: '',
    latitude: 0,
    longitude: 0,
    zoom: 0,
  },
  chatHistory: <ChatDBProps[]>[],
  newChat: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SELECT_ITEM:
      return update(state, {
        selected: { $set: action.data },
      });
    case SELECT_TEAM:
      return update(state, {
        team: { $set: action.data },
      });
    case UPDATE_CHAT:
      return update(state, {
        chatHistory: { $set: action.data },
      });
    case UPDATE_NEW_CHAT:
      return update(state, {
        newChat: { $set: action.data },
      });
    default:
      return state;
  }
}
