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
 */
class HowTo extends Component {
  constructor(props) {
    super(props);
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

export default HowTo;
