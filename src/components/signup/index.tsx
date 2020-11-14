import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from 'react-redux-firebase';

import Container from 'react-bootstrap/Container';
import Blur from '@animate/blur';
import localizationStrings from '../../utils/Localization';
import { providerRoute, pwdRoute } from '../../routes/pathnames';
import { FaSlack } from 'react-icons/fa';

const classNames = require('classnames');

  function SignUp({ firebase, history }) {
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
    }
    else if (!password) {
      setError('Please enter a password')
      setIsLoading(false);
    }
    else if (!passwordsMatch) {
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

  const {
    emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, confirmPasswordLabel, createAccount, create
  } = localizationStrings;

  return (
    <div>
      <div>
        
      </div>
      <div id="signup-root"> 
        <div id="auth-root" className={classNames('box', { translate: animate })}>
          <Form
            onSubmit={handleSubmit}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
          >
            <div className="mb-4">
              <h2>{createAccount}</h2>
            </div>
            <Form.Group controlId="formEmail">
              <Form.Label>{emailLabel}</Form.Label>
              <Form.Control type="email" placeholder={emailPlaceholder} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>{passwordLabel}</Form.Label>
              <Form.Control type="password" placeholder={passwordPlaceholder} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>{confirmPasswordLabel}</Form.Label>
              <Form.Control type="password" placeholder={passwordPlaceholder} onChange={handleConfirmPasswordChange} />
            </Form.Group>
            <br />
            {
              error
              ? (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  <small>{error}</small>
                </Alert>
              )
              : null
            }
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              block
            >
              {isLoading && <div className="loader" />}
              {' '}
              {create}
            </Button>
          </Form>
        </div>
        {/* {
          animate
          ? (
            <Blur>
              <div className="splash fade-out" />
            </Blur>
          )
          : <div className="splash" />
        } */}
      </div>
    </div>
  );
}

export default withFirebase(SignUp);
