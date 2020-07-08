import React from 'react';

function TeamMarker({ member }) {
  return (
    <div className="team-marker">
      <img src={member.image} className="team-marker-image" alt="" />
      <div className="team-marker-content">
        <h5>{member.name}</h5>
        <p>{member.message}</p>
      </div>
    </div>
  );
}

export default TeamMarker;
