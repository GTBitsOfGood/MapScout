import React from "react";
import Popup from "reactjs-popup";

export default ({ index, selectedIndex, name, address, onShowMoreClick, onMarkerClick }) => {
    return (
        <Popup
            trigger={
                <div
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    onClick={onMarkerClick}
                >
                    <svg
                        fill="#5EB63B"
                        stroke="white"
                        strokeWidth="2"
                        width="18px"
                        height="18px"
                    >
                        <path d="M1,9a8,8 0 1,0 16,0a8,8 0 1,0 -16,0" />
                    </svg>
                </div>
            }
            position="top center"
            closeOnDocumentClick
            on="focus"
            open={selectedIndex === index}
        >
            <div>
                <div>{name}</div>
                <div>{address}</div>
                <button onClick={onShowMoreClick}>Show More Info</button>
            </div>
        </Popup>
    );
};
