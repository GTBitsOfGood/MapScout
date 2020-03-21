import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes from './components/ProviderRoutes';
import NotFound from './components/NotFound';

const routes = (
  <AppWrapper>
    <HashRouter basename="/">
      <Switch>
        <Route path="/pacts" component={App} />
        <ProviderRoutes/>
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  </AppWrapper>
);

export { routes };
