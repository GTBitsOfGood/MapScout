import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "react-redux-firebase";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import localizationStrings from "../utils/Localization";

const classNames = require("classnames");

const INITIAL_STATE = {
    email: "",
    error: null,
    animate: false,
    isLoading: false,
    submitted: false
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        const { email } = this.state;
        this.setState({ isLoading: true });
        event.preventDefault();
        this.props.firebase.auth().useDeviceLanguage();
        this.props.firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE, submitted: true });
            })
            .catch(error => {
                this.setState({ error: error.message, isLoading: false });
            });
    }

    onChange(event) {
        this.setState({ [event.target.type]: event.target.value });
    }

    render() {
        const { email, error, animate, isLoading, submitted } = this.state;
        const {
            resetPassword,
            submit,
            emailLabel,
            emailPlaceholder,
            login,
            sent,
        } = localizationStrings;

        const isInvalid = email === "";
        return (
            <Container fluid>
                <div
                    id="auth-root"
                    className={classNames("box", { translate: animate })}
                >
                    {!submitted && (
                        <Form onSubmit={this.onSubmit}>
                            <div className="mb-4">
                                <h2>{resetPassword}</h2>
                            </div>
                            <Form.Group controlId="formEmail">
                                <Form.Label>{emailLabel}</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder={emailPlaceholder}
                                    onChange={this.onChange}
                                />
                            </Form.Group>
                            <br />
                            {error ? (
                                <Alert
                                    variant="danger"
                                    onClose={() =>
                                        this.setState({ error: null })
                                    }
                                    dismissible
                                >
                                    <small>{error}</small>
                                </Alert>
                            ) : null}
                            <Button
                                variant="primary"
                                onClick={!isLoading ? this.onSubmit : null}
                                disabled={isLoading || isInvalid}
                                block
                            >
                                {isLoading && <div className="loader" />}{" "}
                                {submit}
                            </Button>
                        </Form>
                    )}
                    {submitted && (
                        <div>
                        <div className="mb-4">
                            <h2>{resetPassword}</h2>
                        </div>
                            <div className="mb-4">{sent}</div>
                            <Button
                                variant="primary"
                                href="#/providers/auth"
                                block
                            >
                                {login}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="splash" />
            </Container>
        );
    }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export default PasswordForgetForm;
