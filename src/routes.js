import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes from './components/ProviderRoutes';

const routes = (
  <AppWrapper>
    <BrowserRouter basename="/">
      <Switch>
        <Route path="/pacts" component={App} />
        <Route path="/ebp" component={App} />
        <ProviderRoutes/>
      </Switch>
    </BrowserRouter>
  </AppWrapper>
);

export { routes };
