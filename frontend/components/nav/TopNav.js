// Import frameworks
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
class TopNav extends React.Component {
  constructor(props) {
    super(props);

    // hides the back arrow and back description
    this.state = {
      hideLeft: this.props.hideLeft ? "hidden" : "visible",
      showRight: this.props.showRight ? "visible" : "hidden",
    };
  }

  // Render method
  // TODO need to insert title
  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
         <AppBar position="fixed" color="primary" style={{ top: 0, bottom: 'auto', height: 48}}>
           <div style={{ margin: "auto" }}>
             { this.props.title || "" }
           </div>

           <Link
             style={{ visibility: this.state.hideLeft, position: "absolute", padding: 12, color: '#FFFFFF', width: "auto"}}
             to={this.props.leftLink || '/'}
           >
             <ArrowBackIos style={{ float: "left" }}/>
             <strong style={{ float: "left" }}> { this.props.leftDescription || "" } </strong>
           </Link>

           <Button
             style={{ float: "right", visibility: this.state.showRight, position: "absolute", top: 8, right: 8, color: '#FFFFFF'}}
             onClick={ this.props.rightAction }
           >
             <a href={ this.props.rightLink } style={{color: "#FFF"}}>
              <strong style={{ float: "right" }}> { this.props.rightDescription || "" } </strong>
             </a>
           </Button>
         </AppBar>
         </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

// Prop validations
TopNav.propTypes = {
  title: PropTypes.string,
  rightDescription: PropTypes.string,
  rightLink: PropTypes.string,
  rightAction: PropTypes.func,
  showRight: PropTypes.bool,
  leftDescription: PropTypes.string,
  leftLink: PropTypes.string,
  hideLeft: PropTypes.bool,
};

export default TopNav;
