import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes from './components/ProviderRoutes';
import NotFound from './components/NotFound';

const routes = (
  <AppWrapper>
    <BrowserRouter basename="/">
      <Switch>
        <Route path="/pacts" component={App} />
        <ProviderRoutes/>
      </Switch>
    </BrowserRouter>
  </AppWrapper>
);

export { routes };
