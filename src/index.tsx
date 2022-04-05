import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { TeamDocProps } from './types/firestore';
import { store, history } from './store';
import routes from './routes';
import { SENTRY_API_KEY } from './config/keys';
import './assets/styles/style';
import Joyride from 'react-joyride';

Sentry.init({
  dsn: SENTRY_API_KEY,
});

const getRoutes = async () => {
  const strRoutes = await store.firestore
    .collection('teams')
    .get()
    .then((doc: TeamDocProps[]) => {
      const arr = [];
      doc.forEach((team: TeamDocProps) => {
        arr.push(`/${team.id}`);
      });
      return arr;
    });



  // render the main component
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {routes(strRoutes)}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  );
};

getRoutes();

