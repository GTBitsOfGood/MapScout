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
        Welcome to Philly Tenant! This application is for you to keep track of payments, communications and events during your tenancy. Upon first signing up, click on the home screen to fill out your lease agreement information.
        </p><p>
        Starting from the home page, there are three main sections, which you will find in the bottom navigation bar.
        </p><p>
        On the right, there are two tabs.
        </p><p>
        First, you have your primary log for payments. After you have submitted a payment to your landlord each month, log the payment with information and photographic evidence.
        </p><p>
        Second, you have the communications tab. Log complaints, repair requests, and other issues, and use the email function to notify your landlord.
        </p><p>
        On the right side of the navigation bar, there are the checklists. Be sure to check that you have completed all items in the move in and move out lists when necessary. Should you need to go to court, there is an essentials list of items to compile and bring, most of which should be safely stored within your records here.
        </p><p>
        IMPORTANT NOTE: Outside the email function, this application does not substitute for tenants making payments, and it does not automatically notify landlords of any issues arising. It is mainly for personal record keeping. If you have any questions, visit <a target="_blank" href="http://www.phillytenant.org/">www.phillytenant.org</a> for more information.
        </p>
      </MuiThemeProvider>
      </div>
      </div>
    );
  }
}

export default Welcome;
