// Import frameworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
// Import material-ui
import { Button } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { matchPath } from 'react-router'

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
 * Component to render
 */
class Authenticate extends Component {
    // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      success: false,
      email: null,
      redirect: false,
    };

    // Bindings so 'this' refers to component
    this.redirect = this.redirect.bind(this);
    this.handleResendSubmit = this.handleResendSubmit.bind(this);

    const match = matchPath(props.history.location.pathname, {
          path: '/authenticate/:token',
          exact: true,
          strict: false
        })
    if (match) {
        const token = match.params.token;
        if (token) {
          axios.post('/api/user/authenticate', {
            token
          })
            .then(response => {
              this.setState({
                error: response.data.error,
                success: response.data.success,
                email: response.data.email,
                redirect: response.data.success,
              });
            })
            // If there was some unhandled error to this point
            .catch(err => {
              this.setState({
                error: err.message,
                success: false,
              });
            });
        }
    }
  }

  // when resend button is clicked, will try to resend authentication email
  handleResendSubmit(event) {
    event.preventDefault();
    axios.post('/api/user/resend')
      .then(response => {
        this.setState({
          error: response.data.error,
          success: response.data.success
        });
      })
      .catch(err => {
        this.setState({
          error: err.message,
          pending: false,
        });
      });
  }

  // Redirect appropriately
  redirect() {
    if (this.state.redirect) {
      return <Redirect to="/login"/>;
    }
  }

  /**
   * Renders actual auth component
   */
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
        {this.redirect()}

        <MuiThemeProvider theme={theme}>
          <h3 style={{'color': '#fff'}}>Account Pending</h3>
          <br/>
          <p style={{'color': '#fff'}}>
            A confirmation email has been sent to the address you provided.
            <br/>
            <br/>
            If you did not receive an email or if your confirmation link expired, make sure you are logged in, then click below to resend.
            <br />
          </p>
          <Button
            color="secondary"
            variant="contained"
            onClick={ this.handleResendSubmit }
            size="large"
            style={{ width: "80%", margin: "0 auto" }}
          >
            Resend Email
          </Button>

          <div style={{'color': '#fc5d5c', 'fontSize': "14px"}}
              visibility={this.state.success ? "hidden" : "visible"}>
            {this.state.error}
          </div>

          <br/>
        </MuiThemeProvider>
        </div>
    );
  }
}

// Prop validations
Authenticate.propTypes = {
  userId: PropTypes.string,
  token: PropTypes.string,
  updateAuthState: PropTypes.func
};

const mapStateToProps = ({ authState }) => {
  return {
    userId: authState.userId,
    token: authState.token,
  };
};

export default connect(mapStateToProps)(Authenticate);
