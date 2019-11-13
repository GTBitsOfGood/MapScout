import React, { Component } from 'react';
import Navbar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import { providerRoute } from "./ProviderRoutes";
import localizationStrings from '../utils/Localization';
const logo = require('../assets/img/logo.png');

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
          isOpen: false
        };
    }

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    render() {
        let { home, facilityUpload } = localizationStrings;
        return (
            <div>
                <Navbar expand="lg">
                    <Navbar.Brand href="/"><img src={logo} style={{width:100}} /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">{home}</Nav.Link>
                            <Nav.Link as={Link} to={providerRoute}>{facilityUpload}</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default NavBar;
