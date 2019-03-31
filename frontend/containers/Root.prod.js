// Import frameworks
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import AppContainer from './AppContainer.js';
import { PersistGate } from 'redux-persist/es/integration/react';

export default function Root({ store, persistor }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired,
};
