import React, { useState } from 'react';

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
import promiseWithTimeout from '../../functions/promiseWithTimeout';
const uuidv4 = require('uuid/v4');



function VerifyOrg({ firebase, history, props }) {
    /*
    
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
    const [item, setItem] = useState(props.selected || {});

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

    async function addFirestore() {
        setIsLoading(true);
        const i = {
          ...item,
          uid: uuidv4(),
          organization: props.organization.name,
          url: props.url

        };
        try {
          await promiseWithTimeout(5000, props.firestore.set({ collection: 'providers', doc: i.facilityName }, i));
          props.history.push(providerRoute);
          console.log(providerRoute);
        } catch (e) {
          setError('Failed to save changes. Please check your network connection or try again later.');
        } finally {
          setIsLoading(false);
        }
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
    */

    return (
        <div>
             <Steps current={3}>
             <Steps.Step title="ACCOUNT INFO" />
             <Steps.Step title="ORGANIZATION INFO" />
             <Steps.Step title="NEXT STEPS" />
            </Steps>
            <h1>Verify your organization</h1>
            <h4>Enter information about your non-profit</h4>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Orginization Name</Form.Label>
                    
                    <Form.Control type="email" />
                    <Form.Text className="text-muted">
                        We'll always share your email with everyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Organization Website URL</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Preferred Mapscout URL</Form.Label>
                    <Form.Control type="confirmPassword"/>
                    <Form.Control type="password" placeholder="mapscout.io/" />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={() => this.nextPath('../components/wrappers/SentryWrapper')}>
                    Next
                </Button>
            </Form>
        </div>
    )
}

export default withFirebase(VerifyOrg);