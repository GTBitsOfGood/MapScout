import React, { useState, useEffect } from 'react';
import { isEmpty, isLoaded, withFirestore } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import YouTube from 'react-youtube';

import { authRoute, providerRoute } from '../navigation/ProviderRoutes';

const logo = require('../../assets/img/logo.svg');
const background = require('../../assets/img/homepage-hero.png');

const opts = {
  width: '100%',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
};

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function Home({ firebaseAuth, firestore }) {
  const [showProviderRoutes, setShowProviderRoutes] = useState(false);
  const [email, setEmail] = useState('');
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isLoaded(firebaseAuth) && !isEmpty(firebaseAuth.auth) && !showProviderRoutes) {
      setShowProviderRoutes(true);
    } else if (showProviderRoutes) {
      setShowProviderRoutes(false);
    }
  }, [firebaseAuth]);

  function handleSubmit() {
    const payload = { email };
    setEmailDisabled(true);
    firestore.set({ collection: 'waitlist', doc: email }, payload).then(
      () => {
        setEmail('');
        setEmailDisabled(false);
        setMessage('Thank you for signing up!');
      },
    );
  }

  return (
    <div id="homepage-root">
      <span id="homepage-background">
        <img src={background} alt="background" />
      </span>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header id="head" className="row-spaced">
          <span id="head-logo">
            <b>MapScout</b>
            {' '}
            <img src={logo} alt="logo" />
          </span>
          <Button as={Link} to={showProviderRoutes ? providerRoute : authRoute}>
            {showProviderRoutes ? 'Go to Dashboard' : 'Login'}
          </Button>
        </header>
        <section id="homepage-body">
          <div className="homepage-col">
            <h1>
              <b>
                Create
                {' '}
                <span style={{ color: '#0269D9' }}>
                  beautiful
                </span>
                {' '}
                resource maps.
              </b>
            </h1>
            <p>
              MapScout makes it
              {' '}
              <b>simple</b>
              {' '}
              to build and customize your own interactive resource map. Our unique template builder gives you
              {' '}
              <b>complete control</b>
              {' '}
              over the information and search filters you present.
            </p>
            <ul style={{ marginLeft: 20 }}>
              <li>Completely free for nonprofits</li>
              <li>100% customer satisfaction</li>
              <li>Mobile friendly</li>
            </ul>
            <Form.Group
              controlId="formEmail"
              style={{
                backgroundColor: '#F3F3F3',
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              <Form.Label>Add your name to our waitlist today</Form.Label>
              <InputGroup>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  aria-label="Sign up for our waitlist"
                  aria-describedby="emailSignup"
                />
                <InputGroup.Append>
                  <Button
                    disabled={emailDisabled || !validateEmail(email)}
                    onClick={handleSubmit}
                    id="emailSignup"
                  >
                    Signup
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text muted>
                { message }
              </Form.Text>
            </Form.Group>
          </div>
          <div className="homepage-col">
            <YouTube id="youtube" videoId="HVVHiNPZ88A" opts={opts} />
          </div>
        </section>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  firebaseAuth: state.firebase,
});

export default compose(withFirestore, connect(mapStateToProps, null))(React.memo(Home));
