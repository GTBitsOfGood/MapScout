// Base page imports
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from 'react-redux-firebase';

import Container from 'react-bootstrap/Container';
import Blur from '@animate/blur';
import localizationStrings from '../../utils/Localization';
import { FaSlack } from 'react-icons/fa';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// Verify Org imports
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import useWindowSize from '../../functions/useWindowSize';
import promiseWithTimeout from '../../functions/promiseWithTimeout';



const classNames = require('classnames');

function SignUp({ firebase, history }) {
  const [stage, setStage] = useState(0);
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState(false);

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

  const [orgName, setOrgName] = useState('');
  const [orgURL, setOrgURL] = useState('');
  const [mapScoutURL, setmapScoutURL] = useState('mapscout.io/');

  const {
      emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, confirmPasswordLabel, createAccount, create,
      orgNamePlaceholder, orgURLPlaceholder
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
            }, 400);
        } catch (err) {
            // TODO: Add translations
            setError(err.message);
            setIsLoading(false);
        }
        setStage(2);
    }
  }

  async function handleVerifyOrgSubmit(newOrgName) {
      if (!isValidURL(orgURL)) {
          setAlert(true);
      } else {
        const orgData = {
          latitude: 33.7756,
          longitude: -84.3963,
          zoom: 5,
          orgUrl: orgURL,
          label: orgName,
          name: orgName.toLowerCase().split(" ").join(""),
          primaryColor: '#000000',
          secondaryColor: '#000000',
          mapScoutUrl: mapScoutURL,
        };
        setStage(3);
        await promiseWithTimeout(5000, firebase.firestore().collection('teams').doc(orgData.name).set(orgData));
      }
  }

  function handleOrgURL(newOrgURL) {
    if (newOrgURL === "Invalid String") {
      setAlert(true);
    } else {
      setOrgURL(newOrgURL);
    }
  }

  function handleOrgName(newOrgName) {
    if (newOrgName === "Invalid String") {
      setAlert(true);
    } else {
      setOrgName(newOrgName);
      setmapScoutURL("mapscout.io/" + newOrgName.toLowerCase().split(" ").join(""));
    }
  }

  function isValidURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
          + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
          + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
          + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
          + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
          + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }
  const content = () => {
    switch (stage) {
      case 0:
        return (
          <div className="sign-up-root">
            <div className="create-map-title"> 
              <p className="title-text-styles">Create maps with us!</p>
            </div>
            <div id="create-map-content">
              <Container className="container">
                <Row>
                  <Col xs="5" className="square">
                    <p>
                      <p className="title-text-styles">Non-Profit Organization</p>
                    </p>
                    <p className="body-text-styles">Get started with your beautiful resource map, for free!</p>
                    <Button className="button" size="sm" onClick={() => setStage(1)}>
                      CREATE NEW ACCOUNT
                    </Button>
                  </Col>
                  <Col xs="5" className="square">
                    <p>
                      <p className="title-text-styles">For-Profit Organization</p>
                    </p>
                      <p className="body-text-styles">Interested in using MapScout? Let's talk!</p>
                    <Button className="button" size="sm">
                      CONTACT US
                    </Button>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        );
        case 1: 
          return (
            <div>
              <Container className="container">
                  <Steps current={0} type="navigation" size="small">
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
                          <Form.Control size="sm" type="password" placeholder={passwordPlaceholder} onChange={handleConfirmPasswordChange}/>
                      </Form.Group>
                      <Button variant="primary" type="submit" onClick={handleSubmit} className="button-1">
                          NEXT
                  </Button>
                  </Form>
                  {show ? 
                              <Alert variant="danger" onClose={() => setShow(false)} dismissible className="alert">
                                  <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                  <p>
                                  Your passwords do not match.
                                  </p>
                              </Alert> : <div />
                      }
              </Container>
          </div>
          );
        case 2:
          return (
            <div>
                <Container>
                <Steps current={1} type="navigation" size="small">
                <Steps.Step title="ACCOUNT INFO" />
                <Steps.Step title="ORGANIZATION INFO" />
                <Steps.Step title="NEXT STEPS" />
                </Steps>
                <div className="title-text">Verify your organization</div>
                <div className="body-text">Enter information about your non-profit</div>
                <Form className="form-group">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Organization Name</Form.Label>
                        <Form.Control size="sm" type="email" value={orgName} placeholder={orgNamePlaceholder} autoComplete="something-unsupported" onChange={(event) => handleOrgName(event.target.value)}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Organization Website URL</Form.Label>
                        <Form.Control size="sm" type="text" value={orgURL} placeholder={orgURLPlaceholder} onChange={(event) => handleOrgURL(event.target.value)}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Mapscout URL</Form.Label>
                        <Form.Control size="sm" type="text" readOnly value={mapScoutURL} placeholder="mapscout.io/" autoComplete="off"/>
                    </Form.Group>
                    <Button className="button-1" variant="primary" type="submit" onClick={handleVerifyOrgSubmit}>
                        Submit
                    </Button>
                </Form>
                {alert ? 
                              <Alert variant="danger" onClose={() => setAlert(false)} dismissible className="alert">
                                  <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                              </Alert> : <div />
                      }
                </Container>
            </div>
          );
        case 3:
          return (
            <div className="container">
                <Steps current={2} type="navigation" size="small">
                  <Steps.Step title="ACCOUNT INFO" />
                  <Steps.Step title="ORGANIZATION INFO" />
                  <Steps.Step title="NEXT STEPS" />
                </Steps>
                <p className="confirm-text">Thank you for applying! 
                    Our team is processing your organization's information and will be in touch with any additional steps as soon as possible. 
                    In the meanintime, your map has been created at {mapScoutURL}, and you can begin to explore Mapscout's features.
                </p>
                <Button variant="primary" type="submit" onClick={() => {}} className="button-2">
                            START EXPLORING
                </Button>
            </div>
          )
        default:
          return null;
    }
  }

  return (
    <div id="signup">
      {content()}
    </div>
  )
}

export default withFirebase(SignUp);
