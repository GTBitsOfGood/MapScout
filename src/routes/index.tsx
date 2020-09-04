import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppWrapper from '../components/wrappers/AppWrapper';
import App from '../components/App';
import ProviderRoutes from '../components/navigation/ProviderRoutes';
import SentryWrapper from '../components/wrappers/SentryWrapper';
import AboutUs from '../components/about';
import Home from '../components/home';
import { homeRoute, aboutRoute } from './pathnames';

function renderComponentWithErrorBoundary<P>(Component: React.ReactType) {
  return (props: P) => (
    <SentryWrapper>
      <Component {...props} />
    </SentryWrapper>
  );
}

const routes = (allRoutes: string[]) => (
  <AppWrapper>
    <BrowserRouter basename="/">
      <Switch>
        <Route exact path={homeRoute} component={renderComponentWithErrorBoundary(Home)} />
        {allRoutes.map((route: string) => (
          <Route path={route} component={renderComponentWithErrorBoundary(App)} />
        ))}
        <Route path={aboutRoute} component={renderComponentWithErrorBoundary(AboutUs)} />
        <ProviderRoutes />
      </Switch>
    </BrowserRouter>
  </AppWrapper>
);

export default routes;
