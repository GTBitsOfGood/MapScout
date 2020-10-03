import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_API_KEY } from '../../config/keys';
import mapConfig from '../about/mapConfig';
import firebase from "firebase";
import { withFirebase } from 'react-redux-firebase';
import { withFirestore } from 'react-redux-firebase';
import Button from 'react-bootstrap/Button';

const defaultLat = 33.7756;
const defaultLng = -84.3963;
const defaultZoom = 2;
const defaultCoords = { defaultLat, defaultLng };

var data = {
    lat: defaultLat,
    lng: defaultLng,
    zoom: defaultZoom,
    center: defaultCoords,
}

const onSave = async () => {
    await firebase.firestore().collection('teams').doc('LA').set(data); 
}

function MapPicker() {
    const mapOptions = {
        styles: mapConfig,
    }
    const [activeItem, setActiveItem] = useState(-1);
    const [center, setCenter] = useState(defaultCoords);

    return (
        <div>
            <p>Latitude: {defaultLat}</p>
            <p>Longitude: {defaultLng}</p>
            <p>Zoom: {defaultZoom}</p>
            <div style={{ height: '100vh', width: '100%'}}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: GOOGLE_API_KEY,
                    }}
                    zoom={17}
                    center={data.center}
                    options={mapOptions}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                ></GoogleMapReact>
                <Button
                    variant="primary"
                    onClick={() => onSave()}
                ></Button>
            </div>
        </div>
    )
}

export default withFirebase(MapPicker);
