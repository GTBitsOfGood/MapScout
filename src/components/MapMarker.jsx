import React from "react";
import Popup from "reactjs-popup";
import Button from "react-bootstrap/Button";

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
            contentStyle={
                {
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0 2px 7px 1px rgba(0,0,0,0.3)",
                    maxWidth: "452px",
                    fontWeight: "300",
                    fontSize: "13px",
                    display: "inline-block",
                    minWidth: "300px"
                }
            }
        >
            <div>
                <h6>{name}</h6>
                <div className="mb-2">{address}</div>
                <Button
                    variant="primary"
                    onClick={onShowMoreClick}
                    size="sm" >
                        Show More Info
                </Button>
            </div>
        </Popup>
    );
};
