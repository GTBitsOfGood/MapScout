import React, { useState } from 'react';
import { withFirebase } from 'react-redux-firebase';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import localizationStrings from '../../utils/Localization';
import { authRoute } from '../../routes/pathnames';

const classNames = require('classnames');

const INITIAL_STATE = {
  email: '',
  error: null,
  animate: false,
  isLoading: false,
  submitted: false,
};

function PasswordForgetFormBase({ firebase }) {
  const [email, setEmail] = useState(INITIAL_STATE.email);
  const [error, setError] = useState(INITIAL_STATE.error);
  const [animate, setAnimate] = useState(INITIAL_STATE.animate);
  const [isLoading, setIsLoading] = useState(INITIAL_STATE.isLoading);
  const [submitted, setSubmitted] = useState(INITIAL_STATE.submitted);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    firebase.auth().useDeviceLanguage();
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmail(INITIAL_STATE.email);
        setError(INITIAL_STATE.error);
        setAnimate(INITIAL_STATE.animate);
        setAnimate(INITIAL_STATE.isLoading);
        setSubmitted(true);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }

  function onChange(event) {
    setEmail(event.target.value);
  }

  const {
    resetPassword,
    submit,
    emailLabel,
    emailPlaceholder,
    login,
    sent,
  } = localizationStrings;

  const isInvalid = email === '';
  return (
    <Container fluid>
      <div
        id="auth-root"
        className={classNames('box', { translate: animate })}
      >
        {!submitted && (
        <Form onSubmit={onSubmit}>
          <div className="mb-4">
            <h2>{resetPassword}</h2>
          </div>
          <Form.Group controlId="formEmail">
            <Form.Label>{emailLabel}</Form.Label>
            <Form.Control
              type="email"
              placeholder={emailPlaceholder}
              onChange={onChange}
            />
          </Form.Group>
          <br />
          {error ? (
            <Alert
              variant="danger"
              onClose={() => setError(INITIAL_STATE.error)}
              dismissible
            >
              <small>{error}</small>
            </Alert>
          ) : null}
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isLoading || isInvalid}
            block
          >
            {isLoading && <div className="loader" />}
            {' '}
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
            href={authRoute}
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

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export default PasswordForgetForm;
