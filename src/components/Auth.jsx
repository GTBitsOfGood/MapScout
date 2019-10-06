import React, { Component, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import  { firebaseConsumer } from '../firebase';

import localizationStrings from '../utils/Localization';

const mapStateToProps = state => (state.mainReducer);
export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: null
        };

        this.inputChange = (event) => {
            const value = event.target.value;
            const name = event.target.type;
            this.setState({
                [name]: value
            });
        };

        this.login = () => {
            this.props.firebase.signInEmailPassword(this.state.email, this.state.password)
                .then(authUser => {
                    this.props.firebase.database.collection("providers").get().then(querySnapshot => {
                        const data = querySnapshot.docs
                        console.log(data); // array of cities objects
                    })
                })
                .catch(error => {
                    this.setState({error: error.message});
                });
        }
    }

    render() {
        let { emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, login, signUp, forgotPassword } = localizationStrings;
        return(
            <Container>
                <div id="auth-container">
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>{emailLabel}</Form.Label>
                            <Form.Control type="email" placeholder={emailPlaceholder} onChange={this.inputChange}/>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>{passwordLabel}</Form.Label>
                            <Form.Control type="password" placeholder={passwordPlaceholder} onChange={this.inputChange}/>
                            <Button variant="link" size="sm" style={{paddingLeft: 0}}>
                                {forgotPassword}
                            </Button>
                        </Form.Group>
                        {
                            this.state.error &&
                                <Alert variant="danger" onClose={() => this.setState({error: null})} dismissible>
                                    {
                                        //TODO: Add translations
                                        this.state.error
                                    }
                                </Alert>
                        }
                        <Button variant="primary" onClick={this.login} block>
                            {login}
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

const auth = firebaseConsumer(Auth);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(auth);
