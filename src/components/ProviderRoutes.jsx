import React, { Component } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase';
import NavBar from './NavBar';
import Auth from './Auth';
import Dashboard from './Dashboard';
import AddProvider from './AddProvider';
import PasswordForgetForm from "./PasswordForget";
import Template from "./template";

export const providerRoute = '/';
export const formRoute = '/provider';
export const authRoute = '/auth';
export const pwdRoute = '/forgot';
export const templateRoute = '/template';

class ProviderRoutes extends Component {
  render() {
    const PrivateRoute = ({ component: Component }) => (
      <Route render={(props) => {
        if (isEmpty(this.props.auth)) {
          this.setState({ key: authRoute });
          return (
            <Redirect to={{
              pathname: authRoute,
              state: { from: props.location },
            }}
            />
          );
        }
        return <Component {...props} />;
      }}
      />
    );

    return (
      <div>
        <NavBar update={() => this.forceUpdate()} />
        { isLoaded(this.props.auth)
                    && (
                    <Switch>
                      <PrivateRoute
                          exact
                          path={providerRoute}
                          component={Dashboard} />
                      <PrivateRoute
                          path={formRoute}
                          component={AddProvider} />
                      <ProviderRoutes
                          exact
                          path={templateRoute}
                          component={Template} />
                      <Route
                          exact
                          path={authRoute}
                          render={() => <Auth onSubmit={() => this.props.history.push(providerRoute)} />} />
                      <Route
                          exact
                          path={pwdRoute}
                          component={PasswordForgetForm} />
                    </Switch>
                    )}
      </div>
    );
  }
}

// Need auth property to check if logged in or loading
export default compose(
  withFirebase,
  connect(({ firebase: { auth } }) => ({ auth })),
)(ProviderRoutes);
