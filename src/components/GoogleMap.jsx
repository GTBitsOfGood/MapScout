import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import API_KEY from '../config/keys';
import MapMarker from './MapMarker';

export default ({
  providers, defaultZoom, defaultCenter, onShowMoreClick,
}) => {
  const [selected, setSelected] = useState(-1);
  const [center, setCenter] = useState(defaultCenter);

  const getMapOptions = (maps) => ({
    clickableIcons: false,
  });

  return (
    <div style={{ height: 'calc(100vh - 115px)', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: API_KEY,
        }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        options={getMapOptions}
        center={center}
      >
        {providers.map(
          ({
            latitude, longitude, facilityName, address,
          }, i) => (
            <MapMarker
              lat={latitude}
              lng={longitude}
              name={facilityName}
              address={address[0]}
              index={i}
              selectedIndex={selected}
              onShowMoreClick={() => onShowMoreClick(i)}
              onMarkerClick={() => {
                  setSelected(selected === i ? -1 : i);
                  setCenter({ lat: latitude, lng: longitude });
                }
              }
            />
          ),
        )}
      </GoogleMapReact>
    </div>
  );
};
