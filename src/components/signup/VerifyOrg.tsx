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
import { processingTextRoute } from '../../routes/pathnames';
import { FaSlack } from 'react-icons/fa';
import promiseWithTimeout from '../../functions/promiseWithTimeout';

function VerifyOrg({ firebase, history }) {        
    const [orgName, setOrgName] = useState('');
    const [orgURL, setOrgURL] = useState('');
    const [mapScoutURL, setmapScoutURL] = useState('mapscout.io/');

    const {
        orgNamePlaceholder, orgURLPlaceholder
    } = localizationStrings;

    async function handleSubmit() {
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
        
        await promiseWithTimeout(5000, firebase.firestore().collection('teams').doc('delete this').set(orgData));
        history.push(processingTextRoute);
    }
    
    function handleOrgNameChange(newOrgName) {
        setOrgName(newOrgName);
        setmapScoutURL("mapscout.io/" + newOrgName.toLowerCase().split(" ").join(""));
    }
    

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
                    <Form.Control size="sm" type="email" placeholder={orgNamePlaceholder} onChange={(event) => handleOrgNameChange(event.target.value)}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Organization Website URL</Form.Label>
                    <Form.Control size="sm" type="text" placeholder={orgURLPlaceholder} onChange={(event) => setOrgURL(event.target.value)}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Mapscout URL</Form.Label>
                    <Form.Control size="sm" type="text" placeholder={mapScoutURL} autoComplete="mapscout.io/" readOnly/>
                </Form.Group>
            </Form>
            <Button className="button-1" variant="primary" type="submit" onClick={handleSubmit}>
                    SUBMIT
            </Button>
            </Container>
        </div>
    )
}




export default withFirebase(VerifyOrg);
  