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
 */
class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <p>HIHIHIH</p>
    </div>
    );
  }
}


export default Welcome;
