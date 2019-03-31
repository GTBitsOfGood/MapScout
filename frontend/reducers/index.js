// Import frameworks
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

// Import reducers
import authReducer from './authReducer';
import notificationReducer from './notificationReducer';

// Config necessary for state persistance
const config = {
  key: 'primary',
  storage,
};

// Root reducer combines all separate reducers and calls appropriate one
const rootReducer = persistCombineReducers(config, {
  authState: authReducer,
  notificationState: notificationReducer,
});

// Export the root reducer
export default rootReducer;
