// Import frameworks
import React, { Component } from 'react';
import axios from 'axios';
import TopNav from '../nav/TopNav';

// Import material-ui
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

    // Bindings so 'this' refers to component
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    /**
     * Call to backend route to log the user in
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
        this.setState({
          error: null,
          pending: false,
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

  render() {
    return (
      <div
        className="container centerContent"
        style={{
          background: "#00ACC1",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}>

      <TopNav
        title="How to Use"
        leftDescription="Home"
        leftLink="/"
      />
      <br/><br/>
      <div
        style={{
          paddingTop: "10%",
          paddingRight: "10%",
          paddingLeft: "10%",
          paddingBottom: "10%",
          justifyContent: "center",
          color: "white",
          textAlign: "left",
        }}
      >
      <MuiThemeProvider theme={theme}>
        <p>
        Hello
        </p>
      </MuiThemeProvider>
      </div>
      </div>
    );
  }
}

export default Welcome;
