import update from 'immutability-helper';
import {SELECT_ITEM} from "../components/Dashboard";

const initialState = {
    selected: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SELECT_ITEM:
            return update(state, {
                selected: {$set: action.data}
            });
        default:
            return state
    }
}
