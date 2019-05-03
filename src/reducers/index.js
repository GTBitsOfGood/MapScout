import { combineReducers } from 'redux';
import mainReducer from './mainReducer';

export const rootReducer = combineReducers({
    mainReducer: mainReducer,
});
