import { connect } from 'react-redux';
import { compose } from 'redux';
import React, { useState, useEffect } from 'react';
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import { Flipper, Flipped } from 'react-flip-toolkit';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { withFirestore } from 'react-redux-firebase';
import { isValidNumberForRegion, parseIncompletePhoneNumber } from 'libphonenumber-js';
import RowForm from './RowForm';
import { providerRoute } from '../../routes/pathnames';
import useWindowSize from '../../functions/useWindowSize';
import promiseWithTimeout from '../../functions/promiseWithTimeout';
import GOOGLE_API_KEY from '../../config/keys';

const uuidv4 = require('uuid/v4');

const steps = [
  'Map', 'Hours', 'Tag', 'Text', 'Toggle',
];

function AddProvider(props) {
  const { width } = useWindowSize();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [item, setItem] = useState(props.selected || {});
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [categories, setCategories] = useState({});
  const [error, setError] = useState('');

  async function fetchData() {
    const collections = props.firestore.collection('categories');
    const f = await collections
      .where('team', '==', props.team.name)
      .where('active', '==', true)
      .where('select_type', '==', 2)
      .get()
      .then((querySnapshot) => {
        const idToData = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          idToData[doc.id] = {
            name: data.name,
            options: data.options,
          };
        });
        return idToData;
      });
    const d = await collections
      .where('team', '==', props.team.name)
      .where('active', '==', true)
      .where('select_type', '==', 0)
      .get()
      .then((querySnapshot) => {
        const idToData = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          idToData[doc.id] = {
            name: data.name,
            options: data.options,
          };
        });
        return idToData;
      });
    const c = await collections
      .where('team', '==', props.team.name)
      .where('active', '==', true)
      .where('select_type', '==', 1)
      .get()
      .then((querySnapshot) => {
        const idToData = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          idToData[doc.id] = {
            name: data.name,
            options: data.options,
          };
        });
        return idToData;
      });
    setFilters(f);
    setDescriptions(d);
    setCategories(c);
  }

  useEffect(() => {
    fetchData().then(setIsLoading(false));
  }, []);

  async function addFirestore() {
    setIsLoading(true);
    const i = {
      ...item,
      id: uuidv4(),
      team: props.team.name,
      latitude: null,
      longitude: null,
    };

    try {
      if (i.address[0] && i.address[0].length > 0) {
        const response = await promiseWithTimeout(5000, fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${
          i.address[0].replace(/\s/g, '%20')
        }&key=${GOOGLE_API_KEY}`));
        const responseJson = await response.json();
        if (responseJson.results.length > 0 && responseJson.results[0].geometry.location) {
          i.latitude = responseJson.results[0].geometry.location.lat;
          i.longitude = responseJson.results[0].geometry.location.lng;
        }
      }
      await promiseWithTimeout(5000, props.firestore.set({ collection: 'providers', doc: i.facilityName }, i));
      props.history.push(providerRoute);
    } catch (e) {
      setError('Failed to save changes. Please check your network connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateFirestore() {
    setIsLoading(true);
    const i = {
      ...item,
      latitude: null,
      longitude: null,
    };

    try {
      if (i.address[0] && i.address[0].length > 0) {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${
          i.address[0].replace(/\s/g, '%20')
        }&key=${GOOGLE_API_KEY}`);
        const responseJson = await response.json();
        if (responseJson.results.length > 0 && responseJson.results[0].geometry.location) {
          i.latitude = responseJson.results[0].geometry.location.lat;
          i.longitude = responseJson.results[0].geometry.location.lng;
        }
      }
      const { firestore } = props;
      // here the item.id needs to be added to the google firebase console
      await firestore.get({ collection: 'providers', where: ['id', '==', i.id] }).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          firestore.update({ collection: 'providers', doc: doc.id }, i);
        });
      });
      await props.firestore.get('providers');
      props.history.push(providerRoute);
    } catch (e) {
      setError('Failed to save changes. Please check your network connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  function next() {
    setStep(step + 1);
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
  }

  function prev() {
    setStep(step - 1);
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
  }

  if (isLoading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert
          variant="danger"
          onClose={() => setError('')}
          dismissible
        >
          {error}
        </Alert>
      )}

      <Row>
        <Col xs={12} md={4} lg={3}>
          <div className="step-wrapper">
            <Steps current={step} direction={width > 768 ? 'vertical' : 'horizontal'} labelPlacement={width > 768 ? 'horizontal' : 'vertical'}>
              <Step
                title="Map"
              />
              <Step
                title="Hours"
              />
              <Step
                title="Tag"
              />
              <Step
                title="Text"
              />
              <Step
                title="Toggle"
              />
            </Steps>
            {width > 768 && (
            <>
              <br />
              <Button
                block
                disabled={!completed}
                onClick={
                                        props.selected
                                        && props.selected.facilityName
                                          ? updateFirestore
                                          : addFirestore
                                    }
              >
                {props.selected
                                    && props.selected.facilityName
                  ? 'Edit'
                  : 'Add'}
                {' '}
                Provider
              </Button>
              <Button
                as={Link}
                to={providerRoute}
                variant="link"
                block
              >
                Cancel
              </Button>
            </>
            )}
          </div>
        </Col>
        <Col xs={12} md={8} lg={9}>
          <Flipper flipKey={step}>
            <Flipped flipId="form">
              <div className="bg-white p-3">
                <Flipped inverseFlipId="form" scale>
                  <Form>
                    <Row>
                      <Col>
                        <h2>
                          {steps[step]}
                          {' '}
                          Info
                        </h2>
                      </Col>
                      <Col xs="auto">
                        <ButtonToolbar>
                          {
                                                    step > 0
                                                    && <Button onClick={prev} variant="link">Back</Button>
                                                }
                          <Button
                            onClick={step === 4 ? addFirestore : next}
                            disabled={!completed && step === 4}
                            variant="primary"
                          >
                            {step === 4
                              ? props.selected && props.selected.facilityName
                                ? 'Edit Provider'
                                : 'Add Provider'
                              : 'Next'}
                          </Button>
                        </ButtonToolbar>
                      </Col>
                    </Row>
                    <hr />
                    <div>
                      <div className={animate ? 'fade-in' : 'hide'}>
                        <RowForm
                          step={step}
                          item={item}
                          setItem={(i) => {
                            const c = i.facilityName.length > 0
                                                        && i.phoneNum[0]
                                                        && isValidNumberForRegion(parseIncompletePhoneNumber(i.phoneNum[0]), 'US');
                            setItem(i);
                            setCompleted(c);
                          }}
                          filters={filters}
                          descriptions={descriptions}
                          categories={categories}
                        />
                      </div>
                    </div>
                  </Form>
                </Flipped>
              </div>
            </Flipped>
          </Flipper>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withFirestore,
  connect((state) => ({
    providers: state.firestore.ordered.providers,
    firebase: state.firebase,
    selected: state.item.selected,
    team: state.item.team,
  })),
)(AddProvider);
