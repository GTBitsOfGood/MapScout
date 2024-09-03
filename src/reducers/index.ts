import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import itemReducer from "./item";

export default combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    item: itemReducer,
});
