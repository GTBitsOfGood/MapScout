import React, { Component } from 'react';
import Navbar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";

import localizationStrings from '../utils/Localization';

class NavBar extends Component {
    constructor(props, context) {
        super(props, context);
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
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/">PACTS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">{home}</Nav.Link>
                            <Nav.Link as={Link} to="/providers">{facilityUpload}</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default NavBar;
