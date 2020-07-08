/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes from './components/ProviderRoutes';
import SentryWrapper from './components/SentryWrapper';

function renderComponentWithErrorBoundary(Component) {
  return (props) => (
    <SentryWrapper>
      <Component {...props} />
    </SentryWrapper>
  );
}

const routes = (allRoutes) => (
  <AppWrapper>
    <BrowserRouter basename="/">
      <Switch>
        {allRoutes.map((route) => (
          <Route path={route} component={renderComponentWithErrorBoundary(App)} />
        ))}
        <ProviderRoutes />
      </Switch>
    </BrowserRouter>
  </AppWrapper>
);

export { routes };
