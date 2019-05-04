import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import CsvUpload from './CsvUpload';
import NavBar from './NavBar';

class About extends Component {
    constructor(props, context) {
      console.log('inside about !!!');
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
        const {
          testThing
        } = this.props;

        return (
            <div>
            <NavBar/>
                <RB.Grid>
                    <RB.Row>
                        <RB.Col xs={4} md={2} />
                        <RB.Col xs={12} md={8}>
                            <RB.PageHeader>
                                About !!!!!!
                                <br />
                            </RB.PageHeader>
                        </RB.Col>
                        <RB.Col xs={4} md={2} />
                    </RB.Row>
                </RB.Grid>
                <CsvUpload>
                </CsvUpload>
            </div>
        )
    }
}

export default About;
