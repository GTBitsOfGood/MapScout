// Import frameworks
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// Import user components
import Welcome from '../components/home/Welcome';
import HowTo from '../components/home/HowTo';

/**
 * Render the app container
 */
class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reloading: true,
    };

    this.allRoutes = this.allRoutes.bind(this);
  }

  // When the component mounts --> make sure to hydrate loggedIn and authenticated
  componentDidMount() {
    this.setState({
      reloading: false
    });
  }

  // After log in and authentication can access all routes
  allRoutes() {
    return (
      <Switch>
        <Route
          exact path="/"
          render={(props) =>
            <Welcome
              {...props}
              />
            }
          />

        <Route exact path="/howto" component={HowTo} />
      </Switch>
    );
  }

  // Determine which set of routes to use
  getRoutes() {
    return this.allRoutes();
  }

  redirect() {
    return <Route render={() => <Redirect to="/home"/>} />;
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
