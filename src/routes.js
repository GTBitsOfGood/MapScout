import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes from './components/ProviderRoutes';

const routes = (routes) => (
  <AppWrapper>
    <BrowserRouter basename="/">
      <Switch>
        {routes.map((route) => (
          <Route path={route} component={App} />
        ))}
        <ProviderRoutes/>
      </Switch>
    </BrowserRouter>
  </AppWrapper>
);

export { routes };
