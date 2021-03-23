import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import AppWrapper from '../components/wrappers/AppWrapper';
import Map from '../components/map';
import ProviderRoutes from '../components/navigation/ProviderRoutes';
import SentryWrapper from '../components/wrappers/SentryWrapper';
import AboutUs from '../components/about';
import SignUp from '../components/signup';
import Home from '../components/home';
import settings from '../components/settings';
import SignUpRoutes from '../components/signup/SignupRoutes';
import { homeRoute, aboutRoute, signupRoute, settingsRoute } from './pathnames';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateMyAccount from 'components/signup/CreateMyAccount';
import VerifyOrg from 'components/signup/VerifyOrg';
import ProcessingText from 'components/signup/ProcessingText';

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
          <Route path={route} component={renderComponentWithErrorBoundary(Map)} />
        ))}
        <Route path={aboutRoute} component={renderComponentWithErrorBoundary(AboutUs)} />
        <Route path={signupRoute} component={renderComponentWithErrorBoundary(ProcessingText)}  />        
        <Route path={settingsRoute} component={renderComponentWithErrorBoundary(settings)} />
        <ProviderRoutes />
        <SignUpRoutes />
      </Switch>
    </BrowserRouter>
  </AppWrapper>
);

export default routes;
