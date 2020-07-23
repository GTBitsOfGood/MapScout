/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppWrapper from './components/AppWrapper';
import App from './components/App';
import ProviderRoutes from './components/ProviderRoutes';
import SentryWrapper from './components/SentryWrapper';
import AboutUs from './components/about';
import Home from './components/home';

export const homeRoute = '/';
export const aboutRoute = '/about';

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
        <Route exact path={homeRoute} component={renderComponentWithErrorBoundary(Home)} />
        {allRoutes.map((route) => (
          <Route path={route} component={renderComponentWithErrorBoundary(App)} />
        ))}
        <Route path={aboutRoute} component={renderComponentWithErrorBoundary(AboutUs)} />
        <ProviderRoutes />
      </Switch>
    </BrowserRouter>
  </AppWrapper>
);

export { routes };
