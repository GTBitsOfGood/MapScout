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
import Template from "./template/index";
import NotFound from "./NotFound";

export const providerRoute = '/provider';
export const formRoute = '/provider/add';
export const authRoute = '/';
export const pwdRoute = '/forgot';
export const templateRoute = '/provider/template';

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
          return <Component {...props} />
      }}
      />
    );

    return (
      <div>
        { isLoaded(this.props.auth)
            && (
            <Switch>
                <Route path={providerRoute}>
                    <React.Fragment>
                        <NavBar/>
                        <div className="dashboard-content">
                            <Switch>
                                <PrivateRoute
                                    exact
                                    path={providerRoute}
                                    component={Dashboard} />
                                <PrivateRoute
                                    path={formRoute}
                                    component={AddProvider} />
                                <PrivateRoute
                                    path={templateRoute}
                                    component={Template} />
                            </Switch>
                        </div>
                    </React.Fragment>
                </Route>
                <Route
                    exact
                    path={authRoute}
                    render={() => <Auth onSubmit={() => this.props.history.push(providerRoute)} />} />
                <Route
                    path={pwdRoute}
                    component={PasswordForgetForm} />
                <Route exact path="*" component={NotFound} />
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
