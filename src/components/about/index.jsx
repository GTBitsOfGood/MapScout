import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import GOOGLE_API_KEY from '../../config/keys';
import mapConfig from './mapConfig';
import markersConfig from './markersConfig';
import TeamMarker from './TeamMarker';

const lat = 33.7756;
const lng = -84.3963;
const coords = { lat, lng };

function AboutUs() {
  const mapOptions = {
    styles: mapConfig,
  };

  return (
    <div id="about-root">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: GOOGLE_API_KEY,
        }}
        zoom={17.8}
        defaultCenter={coords}
        options={mapOptions}
      >
        {
          markersConfig.map((member) => (
            <TeamMarker
              key={member.name}
              lat={member.lat}
              lng={member.lng}
              member={member}
            />
          ))
        }
      </GoogleMapReact>
    </div>
  );
}

export default AboutUs;
