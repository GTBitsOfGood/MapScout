import React, { Component } from 'react';
import Navbar from 'react-bootstrap/NavBar';
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import { providerRoute } from "./ProviderRoutes";
import localizationStrings from '../utils/Localization';
const logo = require('../assets/img/logo.png');

const languageTitles = {
    "en": "English",
    "es": "Español",
    "zh": "中文",
};

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };
    }

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    render() {
        let { home, admin } = localizationStrings;
        return (
            <div>
                <Navbar expand="lg">
                    <Navbar.Brand as={Link} to="/"><img src={logo} style={{width:100}} /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link as={Link} to={providerRoute}>{admin}</Nav.Link>
                            <NavDropdown
                                alignRight
                                title={languageTitles[localizationStrings.getLanguage()]}>
                                {
                                    Object.keys(languageTitles).map((key) =>
                                        <NavDropdown.Item onClick={
                                            () => {
                                                localizationStrings.setLanguage(key);
                                                this.props.update();
                                            }
                                        }>
                                            {languageTitles[key]}
                                        </NavDropdown.Item>
                                    )
                                }
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default NavBar;
