import React, { useState } from 'react';
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

const NavBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    let { home, admin } = localizationStrings;
  
    const toggle = () => {
      setIsOpen(!isOpen);
    }
  
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
                                                props.update();
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

export default NavBar;
