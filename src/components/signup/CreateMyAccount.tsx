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
import { providerRoute, pwdRoute } from '../../routes/pathnames';
import { FaSlack } from 'react-icons/fa';

function CreateMyAccount({ firebase, history }) {
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
            setIsLoading(false);
        }
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
                history.push(providerRoute);
            }, 400);
        } catch (err) {
            // TODO: Add translations
            setError(err.message);
            setIsLoading(false);
        }
    }

    return (
        <div>
             <Steps current={2}>
             <Steps.Step title="ACCOUNT INFO" />
             <Steps.Step title="ORGANIZATION INFO" />
             <Steps.Step title="NEXT STEPS" />
            </Steps>
            <h1>Set up your account information</h1>
            <h4>Create your account</h4>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" onChange={(email) => setEmail(email)}/>
                    <Form.Text className="text-muted">
                        We'll always share your email with everyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={(password) => setPassword(password)}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="confirmPassword" onChange={(password) => setPassword(password)}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={() => this.nextPath('../components/wrappers/SentryWrapper')}>
                    Next
                </Button>
            </Form>
        </div>
    )
}

export default withFirebase(CreateMyAccount);