import React, { useState, useEffect } from 'react';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import LazyLoad from 'react-lazy-load';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import YouTube from 'react-youtube';

import { authRoute, providerRoute } from '../ProviderRoutes';

const logo = require('../../assets/img/logo.svg');
const background = require('../../assets/img/homepage-hero.png');

const opts = {
  width: '100%',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
};

function Home({ firebaseAuth }) {
  const [showProviderRoutes, setShowProviderRoutes] = useState(false);

  useEffect(() => {
    if (isLoaded(firebaseAuth) && !isEmpty(firebaseAuth.auth) && !showProviderRoutes) {
      setShowProviderRoutes(true);
    } else if (showProviderRoutes) {
      setShowProviderRoutes(false);
    }
  }, [firebaseAuth]);

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
                <span style={{ color: 'blue' }}>
                  beautiful
                </span>
                {' '}
                resource maps.
              </b>
            </h1>
            <p>
              MapScout makes it
              {' '}
              <b>simple and easy</b>
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
            <p style={{ color: 'blue' }}>Add your name to our waitlist today!</p>
            <InputGroup>
              <FormControl
                type="email"
                placeholder="name@example.com"
                aria-label="Sign up for our mailing list"
                aria-describedby="emailSignup"
              />
              <InputGroup.Append>
                <Button id="emailSignup">
                  Signup
                </Button>
              </InputGroup.Append>
            </InputGroup>
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

export default connect(mapStateToProps, null)(React.memo(Home));
