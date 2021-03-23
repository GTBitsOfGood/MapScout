import React, { useState, useEffect, useMemo, Component, ReactType } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  withFirestore, isEmpty, isLoaded, withFirebase,
} from 'react-redux-firebase';
import CreateMyAccount from '../signup/CreateMyAccount';
import VerifyOrg from '../signup/VerifyOrg';
import ProcessingText from '../signup/ProcessingText';
import AddProvider from '../dashboard/AddProvider';
import PasswordForgetForm from '../auth/PasswordForget';
import Template from '../template';
import NotFound from '../NotFound';
import SentryWrapper from '../wrappers/SentryWrapper';
import { selectTeam } from '../../functions/reduxActions';

import {
  createAccountRoute, verifyOrgRoute,processingTextRoute, signupRoute
} from '../../routes/pathnames';
import signup from '.';


const SignUpRoutes = (props) => {
  return (
    <SentryWrapper>
      <Switch>
        <Route path={signupRoute}>
        </Route>
        <Route
          path={createAccountRoute}
          component={CreateMyAccount}
        />
        <Route
          path={verifyOrgRoute}
          component={VerifyOrg}
        />
        <Route
          path={processingTextRoute}
          component={ProcessingText}
        />
      </Switch>
    </SentryWrapper>
  );
};

export default withFirebase(SignUpRoutes)
