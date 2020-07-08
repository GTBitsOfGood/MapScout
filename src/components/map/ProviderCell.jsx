import Badge from 'react-bootstrap/Badge';
import React, { useEffect, useState } from 'react';
import {
  FaMapMarkerAlt, FaPhone, FaTimesCircle, FaLocationArrow, FaMap,
} from 'react-icons/fa';
import LazyLoad from 'react-lazy-load';
import GOOGLE_API_KEY from '../../config/keys';

const classNames = require('classnames');

export default ({
  item, index, onMouseEnter, onClick, distances, primaryColor,
}) => {
  useEffect(() => {
    if (distances && distances.length > 0) {
      setMyDistance(distances.find((x) => Object.keys(x)[0] === item.facilityName)[item.facilityName]);
    } else if (myDistance) {
      setMyDistance(null);
    }
  }, [distances]);

  const [image, setImage] = useState('bog');
  const [myDistance, setMyDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof item.imageURL === 'string') {
          await setImage(item.imageURL);
        } else {
          const res = await fetch(`https://maps.googleapis.com/maps/api/streetview?size=100x100&location=${item.latitude},${item.longitude}&fov=80&heading=70&pitch=0&key=${GOOGLE_API_KEY}`);
          setImage(res.url);
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div
      className="map-cell padder row-nowrap"
      key={index}
      style={{
        borderLeftColor: primaryColor,
        borderTopWidth: index === 0 ? 0 : 1,
        paddingTop: index === 0 ? 0 : 18,
        width: '100%',
      }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <LazyLoad
        width={100}
        height={100}
        debounce={false}
        offsetVertical={500}
      >
        <img
          src={image}
          className={classNames('provider-cell-image', { blur: isLoading })}
          alt=""
        />
      </LazyLoad>
      <div style={{ marginLeft: 12, width: '100%' }}>
        <h5>
          <b style={{ marginRight: 20 }}>{ item.facilityName }</b>
          {item.therapyTypes && item.therapyTypes.includes('Pri-CARE')
                    && (
                    <Badge
                      style={{ marginRight: 20, backgroundColor: primaryColor }}
                      variant="primary"
                    >
                      Pri-CARE
                    </Badge>
                    )}
          {item.therapyTypes && item.therapyTypes.includes('TF-CBT')
                    && (
                    <Badge
                      style={{ backgroundColor: primaryColor }}
                      variant="primary"
                    >
                      TF-CBT
                    </Badge>
                    )}
        </h5>
        <div style={{ color: 'gray' }}>
          <FaMapMarkerAlt size="20px" />
          {' '}
          { item.address[0] }
          <div className="row-spaced">
            <div>
              <FaPhone />
              {' '}
              { item.phoneNum.join(', ') }
            </div>
            {
                            myDistance
                            && (
                            <small>
                              <FaLocationArrow style={{ marginRight: 8 }} />
                              { `${myDistance} mi` }
                            </small>
                            )
                        }
          </div>
        </div>
      </div>
    </div>
  );
};
