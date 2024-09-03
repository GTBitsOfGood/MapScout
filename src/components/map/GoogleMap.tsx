import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { GOOGLE_API_KEY } from "../../config/keys";
import MapMarker from "./MapMarker";

function arePointsNear(checkPoint, centerPoint, km) {
    const ky = 40000 / 360;
    const kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
    const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

export default ({
    providers,
    defaultZoom,
    defaultCenter,
    onShowMoreClick,
    selectedMarker,
    primaryColor,
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
            if (
                !arePointsNear(
                    { lat, lng },
                    center,
                    (40000 / 2 ** zoom) * 2 - 11,
                )
            ) {
                setCenter({ lat, lng });
            }
        }
    }, [selectedMarker, providers]);

    return (
        <GoogleMapReact
            bootstrapURLKeys={{
                key: GOOGLE_API_KEY,
            }}
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            options={getMapOptions}
            zoom={zoom}
            center={center}
            onZoomAnimationEnd={(val) => setZoom(val)}
            resetBoundsOnResize={true}
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
                        primaryColor={primaryColor}
                        onShowMoreClick={() => onShowMoreClick(i)}
                        onMarkerClick={() => {
                            setSelected(selected === i ? -1 : i);
                            setCenter({ lat: latitude, lng: longitude });
                        }}
                    />
                ),
            )}
        </GoogleMapReact>
    );
};
