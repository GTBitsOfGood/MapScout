import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

import MapMarker from './MapMarker';

export default ({ providers, defaultZoom, defaultCenter, onShowMoreClick }) => {
    const [selected, setSelected] = useState(-1);

    const getMapOptions = (maps) => {
        return {
            clickableIcons: false
        };
    }

    return (
        <div style={{ height: "calc(100vh - 115px)", width: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyCS2-Xa70z_LHWyTMvyZmHqhrYNPsDprMQ"
                }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                onChildClick={(hoverKey, childProps) => {
                    setSelected(hoverKey == selected ? -1 : hoverKey);
                    console.log(childProps);
                }}
                options={getMapOptions}
            >
                {providers.map(
                    ({ latitude, longitude, facilityName, address }, i) => (
                        <MapMarker
                            lat={latitude}
                            lng={longitude}
                            name={facilityName}
                            address={address[0]}
                            index={i}
                            selectedIndex={selected}
                            onShowMoreClick={onShowMoreClick}
                        />
                    )
                )}
            </GoogleMapReact>
        </div>
    );
}