// Import frameworks
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#00BCD4',
      contrastText: '#FFFFFF'
    },
    secondary: { main: '#FFFFFF',
      contrastText: '#FFFFFF'
    }
  },
  typography: {
    useNextVariants: true,
  },
});

/**
 * Component to render the navbar
 */
class PaymentIssueNav extends React.Component {
  constructor(props) {
    super(props);

    // Index represents which tab we are currently looking at
    // 0: payment; 1: issue
    this.state = {
      index: this.props.index,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value) {
    this.setState({ index: value });
  }

  // Render method
  render() {
    return (
     <React.Fragment>
     <MuiThemeProvider theme={theme}>
      <AppBar position="fixed" color="primary" style={{top: 0, bottom: 'auto', height: 48}}>
      <Tabs
          fullWidth
          value={this.state.index}
          onChange={this.handleChange}
          indicatorColor="primary"
        >
          <Tab label="Payments" component={Link} to="/payment/all" />
          <Tab label="Issues" component={Link} to="/issue/all" />
      </Tabs>
      </AppBar>
      </MuiThemeProvider>
     </React.Fragment>
    );
  }
}

// Prop validations
PaymentIssueNav.propTypes = {
  index: PropTypes.number,
};

export default PaymentIssueNav;
