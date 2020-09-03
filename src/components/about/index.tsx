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

  const [activeItem, setActiveItem] = useState(-1);
  const [center, setCenter] = useState(coords);

  return (
    <div id="about-root">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: GOOGLE_API_KEY,
        }}
        zoom={17}
        center={center}
        options={mapOptions}
      >
        {
          markersConfig.map((member, index) => (
            <TeamMarker
              active={index === activeItem}
              onClick={() => {
                setActiveItem(index);
                setCenter({ lat: member.lat, lng: member.lng });
              }}
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
