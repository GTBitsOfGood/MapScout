// Import frameworks
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { persistStore } from 'redux-persist';
import { compose, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducers';

// Import styling
import './assets/stylesheets/base.scss';

// Create store for redux
const store = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(logger),
  )
);

// Allows persisting between refreshes
const persistor = persistStore(store);

// Persist store allows redux state to not reset when page refresh
persistStore(
  store,
  null,
  () => store.getState()
);

// Render the app
render(
  <Root store={store} persistor={persistor}/>,
  document.getElementById('root')
);
