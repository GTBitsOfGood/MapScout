import update from 'immutability-helper';
import { SELECT_ITEM, SELECT_TEAM } from '../components/Dashboard';

const initialState = {
  selected: null,
  team: {
    name: "",
    logoUrl: "",
    primaryColor: "",
    secondaryColor: "",
    label: "",
  }
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
    default:
      return state;
  }
}
