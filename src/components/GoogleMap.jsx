import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import API_KEY from '../config/keys';
import MapMarker from './MapMarker';

function arePointsNear(checkPoint, centerPoint, km) {
  const ky = 40000 / 360;
  const kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
  const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
  const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}

export default ({
  providers, defaultZoom, defaultCenter, onShowMoreClick, selectedMarker,
}) => {
  const [selected, setSelected] = useState(-1);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const getMapOptions = (maps) => ({
    clickableIcons: false,
  });

  useEffect(() => {
    if (selectedMarker > -1 && selectedMarker < providers.length) {
      setSelected(selectedMarker);
      const lat = providers[selectedMarker].latitude;
      const lng = providers[selectedMarker].longitude;
      if (!arePointsNear({ lat, lng }, center, (40000 / Math.pow(2, zoom)) * 2 - 10)) {
        setCenter({ lat, lng });
      }
    }
  }, [selectedMarker]);

  return (
    <div style={{ height: 'calc(100vh - 115px)', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: API_KEY,
        }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        options={getMapOptions}
        zoom={zoom}
        center={center}
        onZoomAnimationEnd={(val) => setZoom(val)}
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
              }}
            />
          ),
        )}
      </GoogleMapReact>
    </div>
  );
};
