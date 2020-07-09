import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

const classNames = require('classnames');

function TeamMarker({ member, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={classNames('team-marker', { active })}
    >
      <img src={member.image} className="team-marker-image" alt="" />
      {
        !active
        && <div className="team-marker-label">{member.name}</div>
      }
      <div className="team-marker-content">
        <h5>
          {`${member.name} `}
          <span
            className="team-marker-link"
            onClick={() => {
              window.open(member.link, '_blank');
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
