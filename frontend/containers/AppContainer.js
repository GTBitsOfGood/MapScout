// Import frameworks
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import user components
import Welcome from '../components/home/Welcome';
import HowTo from '../components/home/HowTo';
import Login from '../components/account/Login';
import Register from '../components/account/Register';
import Delete from '../components/account/Delete';
import Update from '../components/account/Update';
import Authenticate from '../components/account/Authenticate';

// Import image upload component
import SendEmail from '../components/email/SendEmail';

/**
 * Render the app container
 */
class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: undefined,
      authenticated: undefined,
      reloading: true,
    };

    this.allRoutes = this.allRoutes.bind(this);
    this.limitedRoutes = this.limitedRoutes.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setAutState = this.setAuthState.bind(this);
  }

  // When the component mounts --> make sure to hydrate loggedIn and authenticated
  componentDidMount() {
    this.isLoggedIn().then(() => {
      this.isAuthenticated().then(() => {
        // Reloading prevents render from firing prematurely (before which set of routes to use is determined) when refreshing page
        this.setState({
          reloading: false
        });
      });
    });
  }

  // Allows child components to modeify state of this component
  setAuthState(loggedIn, authenticated) {
    if (loggedIn !== null) {
      this.setState({
        loggedIn: loggedIn,
      });
    }

    if (authenticated !== null) {
      this.setState({
        authenticated: authenticated
      });
    }
  }

  isLoggedIn() {
    return axios.get('/api/user/isLoggedIn')
      .then((res) => {
        this.setState({
          loggedIn: res.data.success
        });
      });
  }

  isAuthenticated() {
    return axios.get('/api/user/isAuthenticated')
      .then((res) => {
        this.setState({
          authenticated: res.data.success
        });
      });
  }

  // Before log in or authentication can access only these routes
  limitedRoutes() {
    return (
      <Switch>
        <Route exact
          path="/register"
          render={(props) =>
            <Register
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>

        <Route
          exact path="/login"
          render={(props) =>
            <Login
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>

        <Route
          path="/authenticate/:token"
          render={(props) =>
            <Authenticate
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>
        { !this.state.loggedIn &&  <Route render={() => <Redirect to="/login"/>} /> }

        <Route
          path="/authenticate"
          render={(props) =>
            <Authenticate
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>
        { !this.state.authenticated &&  <Route render={() => <Redirect to="/authenticate"/>} /> }
      </Switch>
    );
  }

  // After log in and authentication can access all routes
  allRoutes() {
    return (
      <Switch>
        <Route
          exact path="/login"
          render={(props) =>
            <Login
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>

        <Route exact
          path="/register"
          render={(props) =>
            <Register
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>

        <Route
          path="/authenticate"
          render={(props) =>
            <Authenticate
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>
        <Route
          path="/authenticate/:token"
          render={(props) =>
            <Authenticate
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }/>

        <Route
          exact path="/"
          render={(props) =>
            <Welcome
              {...props}
              updateAuthState={this.setAuthState.bind(this)}
              />
            }
          />

        <Route exact path="/howto" component={HowTo} />
        <Route exact path="/account/delete" component={Delete} />
        <Route exact path="/account/update" component={Update} />

        /* Send email report routes */
        <Route exact path="/send_email" component={SendEmail} />
      </Switch>
    );
  }

  // Determine which set of routes to use
  getRoutes() {
    if (!this.state.reloading) {
      if (this.state.loggedIn && this.state.authenticated) {
        return this.allRoutes();
      }
      return this.limitedRoutes();
    }
  }

  // Redirect appropriately if not logged in or authenticated
  redirect() {
    if (this.state.loggedIn && !this.state.authenticated) {
      return <Route render={() => <Redirect to="/authenticate"/>} />;
    } else if (!this.state.loggedIn) {
      return <Route render={() => <Redirect to="/login"/>} />;
    }
  }

  // Render the app
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <div>
              { this.getRoutes() }
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default AppContainer;
