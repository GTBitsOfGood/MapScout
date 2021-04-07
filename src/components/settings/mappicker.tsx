import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_API_KEY } from '../../config/keys';
import mapConfig from '../about/mapConfig';
import firebase from "firebase";
import {
    withFirestore, isEmpty, isLoaded, withFirebase,
  } from 'react-redux-firebase';
import Button from 'react-bootstrap/Button';
import { Col, Container, Row, Card} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { SketchPicker } from 'react-color'; 

const defaultLat = 33.7756;
const defaultLng = -84.3963;
const defaultZoom = 5;
const defaultCoords = { lat: defaultLat, lng: defaultLng };

var data = {
    latitude: defaultLat,
    longitude: defaultLng,
    zoom: defaultZoom,
    center: defaultCoords,
}

function MapPicker(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [coords, setCoords] = useState(data.center);
    const [magnification, setMagnification] = useState(data.zoom);
    const [customColorDesired, setCustomColorDesired] = useState(false);
    const [color, setColor] = useState('#FFFFFF');

    function saveColorToFirebase() {
        team = props.team
        // save color to firebase here
    }
    
    const mapOptions = {
        styles: mapConfig,
    }
    const onSave = async () => {
        const center_and_zoom = {
            center: coords,
            zoom: magnification,
        }
        await firebase.firestore().collection('teams').doc('LA').set(center_and_zoom); 
    }
    const changeCenterAndZoom = ({center, zoom}) => {
        setCoords(center);
        setMagnification(zoom);
    }

    return (
        <div style={{ height: '100%', width: '100%'}}>
            <div style={{backgroundColor: 'rgb(255, 255, 255', marginLeft: '150px', padding: '10px', marginBottom: '10px'}}>
                <Container>
                    <Row style={{paddingBottom: '20px', marginTop: '1rem', marginBottom: '1rem', border: '0', borderBottom: '1px solid rgba(0, 0, 0, 0.1)'}}>
                        <Col xs={10}>
                            <h3 style={{fontWeight: 'bold'}}>Personalize your map</h3>
                        </Col>
                        <Col>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onSave()}>
                            Save
                        </Button>
                        </Col>
                    </Row>
                    <Form style={{paddingBottom: '30px'}}>
                        <Form.Group>
                            <Form.Label>Organization Name</Form.Label>
                            <Form.Control size="sm" value={fetchedTeam} type="text" readOnly/>
                        </Form.Group>
                        <Row>
                            <Col xs={9}>
                                <Form.Label>Mapscout URL</Form.Label>
                                <Form.Control size="sm" value={fetchedTeam} type="text" readOnly/>
                            </Col>
                            <Col>
                                <Form.Label>Logo</Form.Label>
                                <Form.Control size="sm" placeholder="Upload button" />
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col>
                            <p>Color</p>
                            <Row>
                                <Col xs={2}>
                                    <Card bg='primary' style={{ width: '3rem', height: '3rem'}}>
                                    </Card>
                                </Col>
                                <Col xs={2}>
                                    <Card bg='info' style={{ width: '3rem', height: '3rem'}}>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card style={{ width: '3rem', height: '3rem'}}>
                                    <Card.Text>
                                        Custom
                                    </Card.Text>
                                    <SketchPicker
                                    color={color}
                                    onChange={(color) => setColor(color)}
                                    />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col style={{ height: '30vh', width: '2px'}}>
                            <p>Map</p>
                            <p>Choose the default location of your map</p>
                            <GoogleMapReact
                                bootstrapURLKeys={{
                                    key: GOOGLE_API_KEY,
                                }}
                                zoom={magnification}
                                center={coords}
                                onChange={({center, zoom}) => changeCenterAndZoom({center, zoom})}
                                options={mapOptions}
                            ></GoogleMapReact>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default withFirebase(MapPicker);