import React, { useState } from 'react';
import { withRouter, Route, Switch, BrowserRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { withFirebase } from 'react-redux-firebase';
import useWindowSize from '../../functions/useWindowSize';

import Container from 'react-bootstrap/Container';
import Blur from '@animate/blur';
import localizationStrings from '../../utils/Localization';
import { providerRoute, pwdRoute, verifyOrgRoute } from '../../routes/pathnames';
import { FaSlack } from 'react-icons/fa';

const classNames = require('classnames');

function CreateMyAccount({ firebase, history }) {
    const [show, setShow] = useState(false);

    const { width } = useWindowSize();
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [animate, setAnimate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const {
        emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, confirmPasswordLabel, createAccount, create
    } = localizationStrings;

    function handleChange(e) {
        const { value, type } = e.target;
        if (type === "email") {
            setEmail(value);
            console.log('setting email to: ' + email)
        } else {
            setPassword(value);
            console.log('setting password to: ' + value);
            if (value === passwordConfirm) {
                setPasswordsMatch(true);
            } else {
                setPasswordsMatch(false);
            }
        } 
    }

    function nextPath(path) {
        this.props.history.push(path);
      }

    function handleConfirmPasswordChange(e) {
        const { value } = e.target;
        setPasswordConfirm(value);
        console.log('setting confirm password to: ' + value);
        if (value === password) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }

    function createUserWithEmailAndPassword({ email, password }) {
        firebase.createUser (
            { email, password },
        )
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        if (!email) {
            setError('Please enter an email')
            setIsLoading(false);
        } else if (!password) {
            setError('Please enter a password')
            setIsLoading(false);
        } else if (!passwordsMatch) {
            setError('Passwords do not match')
            setShow(true)
            setIsLoading(false);
        } else {
            createUserWithEmailAndPassword({ 
                email,
                password,
            });
            setIsLoading(true);
            try {
            const response = await firebase
                .auth()
                setAnimate(true);
                await setTimeout(() => {
                    setIsLoading(false);
                    history.push(verifyOrgRoute);
                }, 400);
            } catch (err) {
                // TODO: Add translations
                setError(err.message);
                setIsLoading(false);
            }
        }
    }

    return (
        <div id="create-root">
            <Container className="container">
                <Steps current={0} type="navigation" labelPlacement="vertical" size="small">
                <Steps.Step title="ACCOUNT INFO"/>
                <Steps.Step title="ORGANIZATION INFO" />
                <Steps.Step title="NEXT STEPS" />
                </Steps>
                <div className="title-text">Set up your account information</div>
                <div className="body-text">Create your account.</div>
                <Form className="form-group">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control size="sm" type="email" placeholder={emailPlaceholder} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control size="sm" type="password" placeholder={passwordPlaceholder} onChange={handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control size="sm" type="confirmPassword" placeholder={passwordPlaceholder} onChange={handleConfirmPasswordChange}/>
                    </Form.Group>
                    {show ? 
                            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                <p>
                                Your passwords do not match.
                                </p>
                            </Alert> : <div />
                    }
                </Form>
                <Button variant="primary" type="submit" onClick={handleSubmit} className="button-1">
                        NEXT
                </Button>
            </Container>
        </div>
    )
}

export default withFirebase(CreateMyAccount);