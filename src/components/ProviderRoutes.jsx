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
import AddCategoryForm from "./AddCategory";

export const providerRoute = '/';
export const formRoute = '/add';
export const authRoute = '/auth';
export const pwdRoute = '/forgotpwd';
export const addRoute = '/addcategory';

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
                      <Route
                        exact
                        path={authRoute}
                        render={() => <Auth onSubmit={() => this.props.history.push(providerRoute)} />}
                      />
                      <Route
                          exact
                          path={pwdRoute}
                          component={PasswordForgetForm}
                      />
                      <Route
                          exact
                          path={addRoute}
                          component={AddCategoryForm}
                      />
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
