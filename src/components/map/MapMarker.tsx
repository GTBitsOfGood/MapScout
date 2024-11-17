import React from "react";
import Popup from "reactjs-popup";
import Button from "react-bootstrap/Button";
import { FaInfoCircle, FaTimes } from "react-icons/fa";

type MapMarkerProps = {
    index: number;
    selectedIndex: number;
    name: string;
    address: string;
    stationNum: number;
    lng: number;
    lat: number;
    onShowMoreClick: () => void;
    onMarkerClick: () => void;
    primaryColor?: string;
};

export default ({
    index,
    selectedIndex,
    name,
    address,
    stationNum,
    onShowMoreClick,
    onMarkerClick,
    primaryColor,
}: MapMarkerProps) => (
    <Popup
        trigger={    
            <div style={{ cursor: "pointer", width: "18px", height: "18px" }} onClick={onMarkerClick}>
                {selectedIndex === index ? (
                    <svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 30 30"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="15" cy="15" r="14" fill="#FFB930" stroke="white" strokeWidth="1" />
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            fill="white"
                            fontSize="12px"
                            fontFamily="Arial"
                            dy=".3em"
                            fontWeight="bold"
                        >
                            {stationNum}
                        </text>
                    </svg>
                ) : (
                    <svg
                        fill="#5EB63B"
                        stroke="white"
                        strokeWidth="2"
                        width="18px"
                        height="18px"
                        viewBox="0 0 30 30"
                    >
                        <circle cx="15" cy="15" r="14" />
                    </svg>
                )}
            </div>
        }
        position="top center"
        closeOnDocumentClick
        on="focus"
        open={selectedIndex === index}
        contentStyle={{
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 2px 7px 1px rgba(0,0,0,0.3)",
            maxWidth: "452px",
            fontWeight: "lighter",
            fontSize: "13px",
            display: "inline-block",
            minWidth: "300px",
        }}
    >
        <div>
            <FaTimes
                style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    cursor: "pointer",
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
                    fontWeight: "lighter",
                    fontSize: "13px",
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
