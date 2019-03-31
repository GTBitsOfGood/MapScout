// Import frameworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// Import material-ui
import { Button, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
      contrastText: '#00ACC1'
    },
  },
  typography: {
    useNextVariants: true,
  },
});

/**
 * Component to render the form for a user logging in
 */
class Login extends Component {
    // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      loggedIn: false,
      authenticated: false,
      showPassword: false,
    };

    // Bindings so 'this' refers to component
    this.redirect = this.redirect.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
  }

  // When login button clicked, will attempt to login on backend (account.js)
  handleLoginSubmit(event) {
    // Prevent the default form action
    event.preventDefault();

    // Pull variables from state
    const { email, password } = this.state;
    if (!email || !password || email === '' || password === '') {
      this.setState({
        error: 'Email or Password is not filled out',
        pending: false,
      });
      return;
    }

    /**
     * Call to backend route to log the user in
     */
    axios.post('/api/user/login', {
      email,
      password,
    })
      .then(response => {
        // If the user did not successfully log in
        if (!response.data.success) {
          this.setState({
            error: response.data.error,
            pending: false,
          });
        // If the user did successfully log in
        } else {
          // Update AppContainer state
          this.props.updateAuthState(true, response.data.authenticated);

          this.setState({
            error: null,
            pending: false,
            loggedIn: true,
            authenticated: response.data.authenticated,
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err.message,
          pending: false,
        });
      });
  }

  /**
   * Dynamically update state when a user types into the email
   */
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  /**
   * Dynamically update state when a user types into the password
   */
  handleChangePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  /**
   * Toggles display of password in text field
   */
  handleClickShowPassword() {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }

  // Redirect appropriately
  redirect() {
    if (this.state.loggedIn && !this.state.authenticated) {
      return <Redirect to="/authenticate"/>;
    }

    if (this.state.loggedIn && this.state.authenticated) {
      return <Redirect to="/"/>;
    }
  }

  /**
   * Renders actual Login component
   */
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
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

      {this.redirect()}

         <br/>
          <MuiThemeProvider theme={theme}>
            <TextField
              id="email"
              label="Email"
              type="email"
              margin="normal"
              variant="outlined"
              onChange={ this.handleChangeEmail }
              style={{ width: "80%", margin: "0 auto" }}
            />

            <br/>

            <TextField
              id="adornment-password"
              label="Password"
              margin="normal"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.handleChangePassword}
              variant="outlined"
              style={{ width: "80%", margin: "0 auto" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <br/>
            <br/>

            <div style={{'color': "#fc5d5c", 'fontSize': "14px"}}
                visibility={this.state.error === '' ? "hidden" : "visible"}>
              {this.state.error}
              <br/>
            </div>

            <Button
              color="secondary"
              variant="contained"
              onClick={ this.handleLoginSubmit }
              size="large"
              style={{ width: "80%", margin: "0 auto" }}
            >
              LOGIN
            </Button>

            <br/>

            <Link
              style={{ color: '#FFF' }}
              to="/register"
            >
              CREATE AN ACCOUNT
            </Link>

            <br/>
            <br/>
          </MuiThemeProvider>
      </div>
    );
  }
}

// Prop validations
Login.propTypes = {
  userId: PropTypes.string,
  updateAuthState: PropTypes.func
};

const mapStateToProps = ({ authState }) => {
  return {
    userId: authState.userId,
  };
};

export default connect(mapStateToProps)(Login);
