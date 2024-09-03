import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { MarkerProps } from "./types";

const classNames = require("classnames");

type TeamMarkerProps = {
    member: MarkerProps;
    active: boolean;
    onClick: () => void;
    lat: number;
    lng: number;
};

function TeamMarker({ member, active, onClick }: TeamMarkerProps) {
    return (
        <div
            onClick={onClick}
            className={classNames("team-marker", { active })}
        >
            <img src={member.image} className="team-marker-image" alt="" />
            {!active && <div className="team-marker-label">{member.name}</div>}
            <div className="team-marker-content">
                <h5>
                    {`${member.name} `}
                    <span
                        className="team-marker-link"
                        onClick={() => {
                            window.open(member.link, "_blank");
                        }}
                    >
                        <FaLinkedin />
                    </span>
                </h5>
                <p>{member.role}</p>
            </div>
        </div>
    );
}

export default TeamMarker;
