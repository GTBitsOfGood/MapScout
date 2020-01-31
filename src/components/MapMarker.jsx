import React from 'react';
import Popup from 'reactjs-popup';

export default ({ selected, name, address }) => {
    return (
        <Popup
            trigger={
                <svg
                    fill="#5EB63B"
                    stroke="white"
                    strokeWidth="2"
                    width="18px"
                    height="18px"
                >
                    <path d="M1,9a8,8 0 1,0 16,0a8,8 0 1,0 -16,0" />
                </svg>
            }
            position="top center"
            closeOnDocumentClick
            on="focus"
            open={selected}
        >
            <div>
                <div>{name}</div>
                <div>{address}</div>
            </div>
        </Popup>
    );
}