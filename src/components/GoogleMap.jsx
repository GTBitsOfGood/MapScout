import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

import MapMarker from './MapMarker';

export default ({ providers, defaultZoom, defaultCenter, highlightedId, onMarkerClick }) => {
    console.log(providers);
    return (
        <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCS2-Xa70z_LHWyTMvyZmHqhrYNPsDprMQ' }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          onChildClick={(hoverKey, childProps) => {
              console.log(hoverKey);
              console.log(childProps);
          }}
        >
            {providers.map(({ latitude, longitude }) => 
                <MapMarker
                    lat={latitude}
                    lng={longitude}
                />
            )}
        </GoogleMapReact>
      </div>
    )
}