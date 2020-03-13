import React, { Component, Fragment } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase';
import NavBar from './NavBar';
import Auth from './Auth';
import Dashboard from './Dashboard';
import AddProvider from './AddProvider';
import PasswordForgetForm from './PasswordForget';
import AdminList from './AdminList';

export const providerRoute = '/providers/dash';
export const formRoute = '/providers/dash/add';
export const authRoute = '/providers/auth';
export const pwdRoute = '/providers/forgotpwd';
export const adminRoute = '/providers/adminList';

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
                      <PrivateRoute exact path={providerRoute} component={Dashboard} />
                      <PrivateRoute path={formRoute} component={AddProvider} />
                      <PrivateRoute path={adminRoute} component={AdminList} />
                      <Route
                        exact
                        path={authRoute}
                        render={() => (
                          <Auth
                            onSubmit={() => this.props.history.push(providerRoute)}
                          />
                        )}
                      />
                      <Route path={pwdRoute} component={PasswordForgetForm} />
                      <Route path="providers/adminList" component={AdminList} />
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
