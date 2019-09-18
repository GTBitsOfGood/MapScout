import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/Button";
import CsvUpload from './CsvUpload';
import NavBar from './NavBar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';


const mapStateToProps = state => (state.mainReducer);

export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar/>
                <Container>
                    {/*TODO: Make login work*/}
                    <Jumbotron>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Jumbotron>
                    {/*TODO: Hide CSV if user hasn't logged in*/}
                    <CsvUpload uploadCsv={file => this.props.uploadCsv(file)} />
                </Container>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(About);
