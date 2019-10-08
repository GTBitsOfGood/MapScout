import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from 'react-redux-firebase'

import localizationStrings from '../utils/Localization';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null
        };

        this.handleChange = (e) => {
            const value = e.target.value;
            const name = e.target.type;
            this.setState({
                [name]: value
            });
        };

        //Login to firebase
        this.handleSubmit = async (e) => {
            e.preventDefault();
            try {
                let response = await this.props.firebase
                    .auth()
                    .signInWithEmailAndPassword(this.state.email, this.state.password);
                this.props.history.push("/providers");
            } catch (err) {
                //TODO: Add translations
                this.setState({error: err.message});
            }
        };
    }

    render() {
        let { emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, login, signUp, forgotPassword } = localizationStrings;
        return(
            <Form>
                <Form.Group controlId="formEmail">
                    <Form.Label>{emailLabel}</Form.Label>
                    <Form.Control type="email" placeholder={emailPlaceholder} onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>{passwordLabel}</Form.Label>
                    <Form.Control type="password" placeholder={passwordPlaceholder} onChange={this.handleChange}/>
                    <Button variant="link" size="sm" style={{paddingLeft: 0}}>
                        {forgotPassword}
                    </Button>
                </Form.Group>
                {
                    this.state.error &&
                        <Alert variant="danger" onClose={() => this.setState({error: null})} dismissible>
                            {this.state.error}
                        </Alert>
                }
                <Button variant="primary" onClick={this.handleSubmit} block>
                    {login}
                </Button>
                <Button variant="link" size="sm" block>
                    {signUp}
                </Button>
            </Form>
        )
    }
}

export default withFirebase(Auth);
