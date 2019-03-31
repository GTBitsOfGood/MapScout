// Import frameworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Nav from '../nav/Nav';

// Import material-ui
import { Button } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// Import logo

// Define color palette
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#FFFFFF',
      contrastText: '#fff'
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#00BCD4'
    },
  },
  typography: {
    useNextVariants: true,
  },
});

/**
 * Render a card welcoming a user
 * If the user is not logged in, prompt them to log in or register
 */
class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false
    };

    // Bindings so 'this' refers to component
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogoutRedirect = this.handleLogoutRedirect.bind(this);
  }

  handleLogout() {
    /**
     * Call to backend route to log the user out
     */
    axios.post('/api/user/logout').then(response => {
      // If the user did not successfully log out
      if (!response.data.success) {
        this.setState({
          error: response.data.error,
          pending: false,
        });
      // If the user did successfully log out
      } else {
        // Update AppContainer state
        this.props.updateAuthState(false, false);

        this.setState({
          error: null,
          pending: false,
          logout: true,
        });
      }
    })
    // If there was some unhandled error to this point
    .catch(err => {
      this.setState({
        error: err.message,
        pending: false,
      });
    });
  }

  handleLogoutRedirect() {
    if (this.state.logout) {
      return <Redirect to="/login"/>;
    }
  }

  render() {
    return (
    <div
      className="container centerContent"
      style={{
        background: "#00ACC1",
        minHeight: "100vh",
        padding: "15%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      { this.handleLogoutRedirect() }
       <br/>
        <MuiThemeProvider theme={theme}>
          <h4 style={{'color': '#fff'}}>PHILLY TENANT</h4>

          <div style={{ height: "3vh" }}/>

          <a target="_blank" href="http://www.phillytenant.org/">
          <Button
            color="secondary"
            variant="contained"
            size="large"
            style={{ width: "80%", margin: "0 auto", boxShadow: "none" }}
          >
            Resources
          </Button>
          </a>

          <div style={{ height: "3vh" }}/>

          <Link to="/leaseAgreement">
          <Button
            color="secondary"
            variant="contained"
            size="large"
            style={{ width: "80%", margin: "0 auto", boxShadow: "none" }}
          >
            Lease Agreement
          </Button>
          </Link>

          <div style={{ height: "3vh" }}/>

          <Link to="/howto">
          <Button
            color="secondary"
            variant="contained"
            size="large"
            style={{ width: "80%", margin: "0 auto", boxShadow: "none" }}
          >
            How to Use
          </Button>
          </Link>

          <div style={{ height: "3vh" }}/>

          <Button
            color="secondary"
            variant="contained"
            onClick={ this.handleLogout }
            size="large"
            style={{ width: "80%", margin: "0 auto", boxShadow: "none" }}
          >
            Log Out
          </Button>
        </MuiThemeProvider>
        <Nav index={1}/>
    </div>
    );
  }
}

// Prop validations
Welcome.propTypes = {
  userId: PropTypes.string,
  name: PropTypes.string,
  updateAuthState: PropTypes.func
};

export default Welcome;
