import React from 'react';
import Popup from 'reactjs-popup';
import Button from 'react-bootstrap/Button';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

type MapMarkerProps = {
  index: number,
  selectedIndex: number,
  name: string,
  address: string,
  lng: number,
  lat: number,
  onShowMoreClick: () => void,
  onMarkerClick: () => void,
  primaryColor?: string
}

export default ({
  index, selectedIndex, name, address, onShowMoreClick, onMarkerClick, primaryColor,
}: MapMarkerProps) => (


  <Popup

    trigger={(
      <div
        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
        onClick={onMarkerClick}
      >
        {selectedIndex === index ? (
          <svg
            fill="#FFB930"
            stroke="white"
            strokeWidth="2"
            width="25px"
            height="30px"
            fillRule="nonzero"
          >
          {/* <div>
            <img src={process.env.PUBLIC_URL + '/logo.png'} style={{width:"120%", height:"120%"}}/> */}
            <path d="M1 12.5C1 7.5 5 1 13 1 21 1 25 7.5 25 12.5 25 21.5 17 26.333 13 31 9 26.5 1 21.112 1 12.5ZM18 12.5a5 5 0 1 0-10 0 5 5 0 1 0 10 0" />
          {/* </div>  */}
          </svg>
        ) : (
          <svg
            fill="#5EB63B"
            stroke="white"
            strokeWidth="2"
            width="18px"
            height="18px"
          >
          {/* <div>
            <img src={process.env.PUBLIC_URL + '/logo.png'} style={{width:"120%", height:"120%"}}/> */}
            <path d="M1,9a8,8 0 1,0 16,0a8,8 0 1,0 -16,0" />
          {/* </div> */}
          </svg>
        )}
      </div>
              )}
    position="top center"
    closeOnDocumentClick
    on="focus"
    open={selectedIndex === index}
    contentStyle={{
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 2px 7px 1px rgba(0,0,0,0.3)',
      maxWidth: '452px',
      fontWeight: 'lighter',
      fontSize: '13px',
      display: 'inline-block',
      minWidth: '300px',
    }}
  >
    <div>
      <FaTimes
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          cursor: 'pointer',
        }}
        onClick={onMarkerClick}
      />
      <h6>{name}</h6>
      <div className="mb-1">{address}</div>
      <Button
        variant="link"
        onClick={onShowMoreClick}
        style={{
          padding: 0,
          fontWeight: 'lighter',
          fontSize: '13px',
          margin: 0,
          color: primaryColor,
        }}
      >
        Show More Info
        <FaInfoCircle className="ml-1" />
      </Button>
    </div>
  </Popup>


);
