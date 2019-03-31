// Import frameworks
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import CalendarIcon from '@material-ui/icons/DateRange';
import PersonIcon from '@material-ui/icons/Person';
import FolderIcon from '@material-ui/icons/FolderOpen';
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
class Nav extends React.Component {
  constructor(props) {
    super(props);

    // index represents which tab we are currently looking at
    // 0: records; 1: account; 2: Checklists
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
      <AppBar position="fixed" color="primary" style={{top: 'auto', bottom: 0}}>
      <Tabs
          fullWidth
          value={this.state.index}
          onChange={this.handleChange}
          indicatorColor="primary"
        >
          <Tab label="Records" icon={<FolderIcon/>} component={Link} to="/payment/all" />
          <Tab label="Home" icon={<PersonIcon/>} component={Link} to="/" />
          <Tab label="Checklists" icon={<CalendarIcon/>} component={Link} to="/checklist" />
      </Tabs>
      </AppBar>
      </MuiThemeProvider>
     </React.Fragment>
    );
  }
}

// Prop validations
Nav.propTypes = {
  index: PropTypes.number,
};

export default Nav;
