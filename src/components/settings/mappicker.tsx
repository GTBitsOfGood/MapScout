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
const defaultZoom = 5;
const defaultCoords = { lat: defaultLat, lng: defaultLng };

var data = {
    latitude: defaultLat,
    longitude: defaultLng,
    zoom: defaultZoom,
    center: defaultCoords,
}

function MapPicker(props) {
    const [coords, setCoords] = useState(data.center);
    const [magnification, setMagnification] = useState(data.zoom);
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
        <div style={{ height: '100vh', width: '100%'}}>
            <p>Latitude: {coords.lat}</p>
            <p>Longitude: {coords.lng}</p>
            <p>Zoom: {magnification}</p>
            <div style={{height: '100%'}}>
                <Button
                    variant="primary"
                    onClick={() => onSave()}
                >Save</Button>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: GOOGLE_API_KEY,
                    }}
                    zoom={magnification}
                    center={coords}
                    onChange={({center, zoom}) => changeCenterAndZoom({center, zoom})}
                    options={mapOptions}
                ></GoogleMapReact>
            </div>
        </div>
    )
}

export default withFirebase(MapPicker);
