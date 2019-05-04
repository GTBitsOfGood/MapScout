import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import CsvUpload from './CsvUpload';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

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
        return (
            <div>
              <Navbar color="light" light expand="md">
                 <NavbarBrand href="/">Philadelphia Alliance of Child Trauma Services</NavbarBrand>
                 <NavbarToggler onClick={this.toggle} />
                 <Collapse isOpen={this.state.isOpen} navbar>
                   <Nav className="ml-auto" navbar>
                     <NavItem>
                       <NavLink href="/about">About</NavLink>
                     </NavItem>
                     <NavItem>
                       <NavLink href="https://github.com/reactstrap/reactstrap">Contact Us</NavLink>
                     </NavItem>
                     <UncontrolledDropdown nav inNavbar>
                       <DropdownToggle nav caret>
                         Manage Resources
                       </DropdownToggle>
                       <DropdownMenu right>
                         <DropdownItem>
                           Option 1
                         </DropdownItem>
                         <DropdownItem>
                           Option 2
                         </DropdownItem>
                         <DropdownItem divider />
                         <DropdownItem>
                           Reset
                         </DropdownItem>
                       </DropdownMenu>
                     </UncontrolledDropdown>
                   </Nav>
                 </Collapse>
             </Navbar>
            </div>
        )
    }
}

export default NavBar;
