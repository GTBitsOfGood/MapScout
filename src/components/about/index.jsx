import React from 'react';
import GoogleMapReact from 'google-map-react';
import GOOGLE_API_KEY from '../../config/keys';
import mapConfig from './mapConfig';

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
        zoom={17}
        defaultCenter={{ lat: 33.7756, lng: -84.3963 }}
        options={mapOptions}
      />
    </div>
  );
}

export default AboutUs;
