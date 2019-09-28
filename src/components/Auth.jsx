import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/Button";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

import localizationStrings from '../utils/Localization';

const mapStateToProps = state => (state.mainReducer);
export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class Auth extends Component {
    render() {
        let { header, description, emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, submit, signUp } = localizationStrings;
        return(
            <Container>
                <div id="auth-container">
                    <h2>{header}</h2>
                    <p>{description}</p>
                    <Form>
                        <hr />
                        <Form.Group controlId="formEmail">
                            <Form.Label>{emailLabel}</Form.Label>
                            <Form.Control type="email" placeholder={emailPlaceholder} />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>{passwordLabel}</Form.Label>
                            <Form.Control type="password" placeholder={passwordPlaceholder} />
                        </Form.Group>
                        <hr />
                        <Button variant="primary" type="submit" block>
                            {submit}
                        </Button>
                        <Button variant="link" size="sm" block>
                            {signUp}
                        </Button>
                    </Form>
                </div>
            </Container>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Auth);

{/*<Jumbotron>*/}
{/*    <Form>*/}
{/*        <Form.Group controlId="formBasicEmail">*/}
{/*            <Form.Label>Email address</Form.Label>*/}
{/*            <Form.Control type="email" placeholder="Enter email" />*/}
{/*        </Form.Group>*/}
{/*        <Form.Group controlId="formBasicPassword">*/}
{/*            <Form.Label>Password</Form.Label>*/}
{/*            <Form.Control type="password" placeholder="Password" />*/}
{/*        </Form.Group>*/}
{/*        <Button variant="primary" type="submit">*/}
{/*            Submit*/}
{/*        </Button>*/}
{/*    </Form>*/}
{/*</Jumbotron>*/}
