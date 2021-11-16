import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from 'react-redux-firebase';

import Container from 'react-bootstrap/Container';
import Blur from '@animate/blur';
import localizationStrings from '../../utils/Localization';
import { providerRoute, pwdRoute } from '../../routes/pathnames';

const classNames = require('classnames');

function Auth({ firebase, history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { value, type } = e.target;
    if (type === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
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
    emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, login, forgotPassword,
  } = localizationStrings;

  return (
    <Container fluid>
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
            <h2>{login}</h2>
          </div>
          <Form.Group controlId="formEmail">
            <Form.Label>{emailLabel}</Form.Label>
            <Form.Control type="email" placeholder={emailPlaceholder} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>{passwordLabel}</Form.Label>
            <Form.Control type="password" placeholder={passwordPlaceholder} onChange={handleChange} />
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
            {login}
          </Button>
          <div className="mt-2">
            <a href={pwdRoute}>
              <small>{forgotPassword}</small>
            </a>
          </div>
        </Form>
      </div>
      {
        animate
        ? (
          <Blur>
            <div className="splash fade-out" />
          </Blur>
        )
        : <div className="splash" />
      }
    </Container>
  );
}

export default withFirebase(Auth);
