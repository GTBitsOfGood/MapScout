import { combineReducers } from 'redux';
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";


const initialState = {
    retreived: false,
    data: []
}

const providerDataReducer = (state = initialState, action) => {
    if (action.type === 'UPDATE_DATA') {
        return Object.assign({}, state, {
            retreived: true,
            data: action.payload
        })
    }
    return state
}

export const rootReducer = combineReducers({
    firestoreData: providerDataReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
});
