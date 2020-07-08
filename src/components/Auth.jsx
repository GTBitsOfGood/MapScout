import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { withFirebase } from 'react-redux-firebase';

import Container from 'react-bootstrap/Container';
import Blur from '@animate/blur';
import localizationStrings from '../utils/Localization';
import { providerRoute, pwdRoute } from './ProviderRoutes';

const classNames = require('classnames');

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      animate: false,
      isLoading: false,
    };

    this.handleChange = (e) => {
      const { value } = e.target;
      const name = e.target.type;
      this.setState({
        [name]: value,
      });
    };

    // Login to firebase
    this.handleSubmit = async (e) => {
      e.preventDefault();
      this.setState({ isLoading: true });
      try {
        const response = await this.props.firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);
        this.setState({ animate: true });
        await setTimeout(() => {
          this.setState({ isLoading: false });
          this.props.history.push(providerRoute);
        }, 400);
      } catch (err) {
        // TODO: Add translations
        this.setState({ error: err.message, isLoading: false });
      }
    };
  }

  render() {
    const {
      emailLabel, emailPlaceholder, passwordLabel, passwordPlaceholder, login, signUp, forgotPassword,
    } = localizationStrings;
    const { isLoading, error, animate } = this.state;
    return (
      <Container fluid>
        <div id="auth-root" className={classNames('box', { translate: animate })}>
          <Form
            onSubmit={this.handleSubmit}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                this.handleSubmit(e);
              }
            }}
          >
            <div className="mb-4">
              <h2>{login}</h2>
            </div>
            <Form.Group controlId="formEmail">
              <Form.Label>{emailLabel}</Form.Label>
              <Form.Control type="email" placeholder={emailPlaceholder} onChange={this.handleChange} />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>{passwordLabel}</Form.Label>
              <Form.Control type="password" placeholder={passwordPlaceholder} onChange={this.handleChange} />
            </Form.Group>
            <br />
            {
                            error
                              ? (
                                <Alert variant="danger" onClose={() => this.setState({ error: null })} dismissible>
                                  <small>{error}</small>
                                </Alert>
                              )
                              : null
                        }
            <Button
              variant="primary"
              onClick={!isLoading ? this.handleSubmit : null}
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
}

export default withFirebase(Auth);
