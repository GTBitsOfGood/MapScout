import React, { useState, useEffect, useMemo, Component, ReactType } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  withFirestore, isEmpty, isLoaded, withFirebase,
} from 'react-redux-firebase';
import SignUp from '../signup/index';
import CreateMyAccount from '../signup/CreateMyAccount';
import VerifyOrg from '../signup/VerifyOrg';
import ProcessingText from '../signup/ProcessingText';

import {
  createAccountRoute, verifyOrgRoute,processingTextRoute, signupRoute
} from '../../routes/pathnames';


const SignUpRoutes = () => {
  return (
      <Switch>
        <Route 
          path={signupRoute} 
          component={SignUp}
        />
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
          render={ProcessingText} 
        />
      </Switch>
  );
};

export default withFirebase(SignUpRoutes)
